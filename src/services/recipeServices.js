require('dotenv').config();
const RecipeBook = require('../models/recipeBook');
const RecipeURL = require('../models/recipeURL');
const Profile = require('../models/profile');
const Recipe = require('../models/recipe');
const ImportedRecipe = require('./recipeImportService');
const RapidAPIService = require('./rapidAPIService');
const { convertRecipeImageOnImport } = require('./convertImageService');
const mongoose = require('mongoose');
const profile = require('../models/profile');

//=========== Helper functions =====================//

const createRecipeURL = async (searchRecipeURLObj) => {
  const newRecipeURLObj = {
    url: searchRecipeURLObj.href,
    origin: searchRecipeURLObj.origin,
    hostname: searchRecipeURLObj.hostname,
    pathname: searchRecipeURLObj.pathname,
    searchParams: searchRecipeURLObj.searchParams
  };
  const newRecipeURLDocument = await RecipeURL.create(newRecipeURLObj);
  return newRecipeURLDocument;
};

const findOneOrCreateRecipeURL = async (recipeURL) => {
  let newRecipe = false;
  const searchRecipeURLObj = new URL(recipeURL);
  const constructedRecipeURLDocument = await RecipeURL.findOne({
    origin: searchRecipeURLObj.origin,
    pathname: searchRecipeURLObj.pathname
  });
  if (constructedRecipeURLDocument) {
    return [constructedRecipeURLDocument, newRecipe];
  }
  const newRecipeURLDocument = await createRecipeURL(searchRecipeURLObj);
  newRecipe = true;
  return [newRecipeURLDocument, newRecipe];
};

const getRecipeBooksByProfileID = async (profileID) => {
  const profileDocument = await Profile.findById(profileID);
  const recipeBookDocuments = await RecipeBook.find({ owner: profileDocument });
  return recipeBookDocuments;
};

const fetchRapidAPIRecipe = async (recipeURLDocument) => {
  const baseURL = 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com';
  const url = recipeURLDocument.origin + recipeURLDocument.pathname;
  const RecipeRequest = new RapidAPIService(
    process.env.RAPIDAPI_KEY,
    baseURL,
    null
  );
  const recipeResponse = await RecipeRequest.fetchRecipe(url);
  console.log(recipeResponse);
  return recipeResponse;
};

const findOneOrCreateRecipeDocument = async (
  recipeURLDocument,
  recipeData = null
) => {
  let recipeDocument = await Recipe.findOne({
    recipeURL: recipeURLDocument._id
  }).populate('ingredients cuisines dishTypes diets occasions equipment');
  if (recipeDocument) {
    return recipeDocument;
  }
  console.log(recipeData, '<-recipeData');
  if (!recipeData) {
    recipeData = await fetchRapidAPIRecipe(recipeURLDocument);
  }
  const newRecipe = new ImportedRecipe(recipeData, recipeURLDocument);
  const recipeObject = await newRecipe.generateRecipeObject();
  recipeDocument = await Recipe.create(recipeObject);
  recipeDocument = await recipeDocument.populate(
    'ingredients cuisines dishTypes diets occasions equipment'
  );
  return recipeDocument;
};

//=========== Responds to controller =================//

const findOneOrCreateRecipe = async (req) => {
  const profileDocument = null;
  const recipeBookDocuments = [];
  if ('profile' in req.body) {
    const profileID = req.body.profile;
    recipeBookDocuments.push(getRecipeBooksByProfileID(profileID));
  }
  if (!req.params.query.startsWith('http')) {
    console.log('recipe url malformed in findOneOrCreateRecipe');
    return new Error('malformed query url');
  }
  const recipeURLRaw = req.params.query;
  let recipeData = null;
  const [recipeURLDocument, newRecipe] = await findOneOrCreateRecipeURL(
    recipeURLRaw
  );
  if (newRecipe) {
    recipeData = await fetchRapidAPIRecipe(recipeURLDocument);
  }
  const recipe = await findOneOrCreateRecipeDocument(
    recipeURLDocument,
    recipeData
  );

  const convertImage = await convertRecipeImageOnImport(
    process.env.IMAGE_API_URL + '/api/image/convert',
    { recipeID: recipe._id, recipeUrl: recipe.image }
  ).then((data) => {
    console.log(data);
  });

  return {
    recipe,
    profile: profileDocument,
    recipeBooks: recipeBookDocuments
  };
};

const fetchRecipesByDishType = async (dishTypeID) => {
  try {
    const recipesByDishTypesDocuments = await Recipe.find({
      dishTypes: dishTypeID
    });
    return recipesByDishTypesDocuments;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const updateFavoriteRecipes = async (recipeID, profileID) => {
  try {
    const recipeDocument = await Recipe.findOne({
      _id: recipeID
    });
    const profileDocument = await Profile.findOne({
      _id: profileID
    });
    console.log(profileDocument, '<-profileDocument');
    const favoriteRecipes = profileDocument.recipes.favoriteRecipes;
    if (favoriteRecipes.includes(recipeID)) {
      let favoriteIndex = favoriteRecipes.indexOf(recipeID);
      const updatedFavoriteRecipes = favoriteRecipes.filter((value, index) => {
        return favoriteIndex !== index;
      });
      console.log(favoriteRecipes, '<-favoriteRecipes');
      profileDocument.recipes.favoriteRecipes = updatedFavoriteRecipes;
      profileDocument.save();
    } else {
      profileDocument.recipes.favoriteRecipes.push(recipeID);
      profileDocument.save();
    }
    return profileDocument;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const createEditedRecipe = async (recipePayload, profileID) => {
  const originalRecipeID = recipePayload.recipeID;
  const originalRecipeDocument = await Recipe.findOne({
    _id: originalRecipeID
  });
  const newRecipeObject = delete originalRecipeDocument._id;
  const recipeEdits = recipePayload.edits;
  const mergedRecipeObject = {
    ...newRecipeObject,
    ...recipeEdits
  };
  mergedRecipeObject.primeRecipe = originalRecipeID;
  mergedRecipeObject.privacy.public = false;
  mergedRecipeObject.privacy.owner = profileID;
  try {
    const newRecipeDocument = new Recipe(mergedRecipeObject);
    const newRecipeID = newRecipeDocument._id;
    await newRecipeDocument.save();
    // Update recipebooks to replace reference to old recipe with new edited version
    const recipeBooksContainingOldRecipe = await RecipeBook.find({
      profile: profileID,
      recipes: originalRecipeID
    });
    for (const recipeBook of recipeBooksContainingOldRecipe) {
      const recipeBookIndex = recipeBook.recipes.findIndex(
        (element) => element === originalRecipeID
      );
      recipeBook.recipes.splice(recipeBookIndex, 1, newRecipeID);
    }
    recipeBooksContainingOldRecipe.save();
    const profileDocument = await Profile.find({
      _id: profileID
    });

    const favoriteIndex = profileDocument.recipes.findIndex(
      (element) => element === originalRecipeID
    );
    if (favoriteIndex > -1) {
      profileDocument.recipes.splice(favoriteIndex, 1, newRecipeID);
    } else {
      profileDocument.recipes.push(newRecipeID);
    }
    profileDocument.save();
    return newRecipeDocument;
  } catch (err) {
    console.log(err);
    return err;
  }
};

module.exports = {
  findOneOrCreateRecipe,
  fetchRecipesByDishType,
  updateFavoriteRecipes,
  createEditedRecipe
};
