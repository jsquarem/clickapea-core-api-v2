const Recipe = require('../models/recipe');
const {
  findOneOrCreateRecipe,
  fetchRecipesByDishType,
  updateFavoriteRecipes,
  createEditedRecipe
} = require('../services/recipeServices');
const GoogleRecipeSchema = require('../services/googleRecipeSchemaService');
const { getIngredientsByRecipeID } = require('../services/ingredientService');
const { getAllDishTypes } = require('../services/dishTypeService');
const sanitize = require('mongo-sanitize');

const getIngredientsByRecipeIDs = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const recipeIDs = sanitize(req.body);
    const ingredientsList = await getIngredientsByRecipeID(recipeIDs);
    res.status(201).send(ingredientsList);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const getNewRecipeImages = async (req, res) => {
  const imagesRequested = 24;
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const recipeURLs = await Recipe.find({})
      .sort('-createdAt')
      .limit(imagesRequested)
      .select(
        'image title readyInMinutes vegan vegetarian glutenFree dairyFree veryHealthy'
      )
      .populate('dishTypes');
    res.status(201).json({ recipeURLs });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const getRecipeCard = async (req, res) => {
  const imagesRequested = 24;
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const recipeURLs = await Recipe.find({})
      .sort('-createdAt')
      .limit(imagesRequested)
      .select('image title readyInMinutes ');
    res.status(201).json({ recipeURLs });
  } catch (err) {
    res.status(400).json({ err });
  }
};

const searchRecipeTitles = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const searchTerm = sanitize(req.params.query);
    const searchResults = await Recipe.aggregate().search({
      autocomplete: {
        query: `${searchTerm}`,
        path: 'title',
        fuzzy: {
          maxEdits: 2
        }
      }
    });

    const searchResultsArray = searchResults.map((searchResult) => {
      const searchResultObj = {
        label: searchResult.title,
        value: String(searchResult._id)
      };
      return searchResultObj;
    });
    res.status(201).json(searchResultsArray);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const getRecipeByID = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const recipeID = sanitize(req.params.recipeID);
    const recipe = await Recipe.findById(recipeID).populate(
      'ingredients cuisines dishTypes diets occasions equipment'
    );
    const recipeSchema = new GoogleRecipeSchema(recipe);
    const googleSchema = await recipeSchema.createGoogleRecipeSchema(recipe);
    console.log(googleSchema, '<-googleSchema');
    res.status(201).json({
      recipe,
      profile: '',
      recipeBooks: [],
      googleSchema
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const getRecipeByURL = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const recipeResponseObject = await findOneOrCreateRecipe(req);
    const recipeSchema = new GoogleRecipeSchema(recipeResponseObject.recipe);
    recipeResponseObject.googleSchema =
      await recipeSchema.createGoogleRecipeSchema(recipeResponseObject.recipe);
    console.log(recipeResponseObject.googleSchema, '<-googleSchema');
    res.status(201).json(recipeResponseObject);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const getRecipeDishTypes = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const dishTypesList = await getAllDishTypes();
    res.status(201).send(dishTypesList);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const getRecipeByDishTypeID = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const dishTypeID = sanitize(req.params.dishTypeID);
    const recipesByDishTypesList = await fetchRecipesByDishType(dishTypeID);
    res.status(201).send(recipesByDishTypesList);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const updateFavoriteRecipeByID = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const recipeID = sanitize(req.params.recipeID);
    const profileID = sanitize(req.params.profileID);
    const updatedProfile = await updateFavoriteRecipes(recipeID, profileID);
    res.status(201).send(updatedProfile);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const createNewRecipeFromEdit = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const recipePayload = sanitize(req.body.recipePayload);
    const profileID = sanitize(req.body.profileID);
    const editedRecipe = await createEditedRecipe(recipePayload, profileID);
    res.status(201).send(editedRecipe);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

module.exports = {
  getIngredientsByRecipeIDs,
  getNewRecipeImages,
  searchRecipeTitles,
  getRecipeByID,
  getRecipeByURL,
  getRecipeDishTypes,
  getRecipeByDishTypeID,
  updateFavoriteRecipeByID,
  createNewRecipeFromEdit
};
