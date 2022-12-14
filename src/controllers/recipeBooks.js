// const Profile = require('../models/profile');
const Recipe = require('../models/recipe');
const RecipeBook = require('../models/recipeBook');
const sanitize = require('mongo-sanitize');

const createRecipeBook = async (req, res) => {
  const profileID = sanitize(req.user.profile);
  const recipeBookName = sanitize(req.body.name);
  let recipeBookDocument = {
    name: '',
    profile: ''
  };
  res.set('Access-Control-Allow-Origin', '*');
  try {
    recipeBookDocument = await RecipeBook.findOne({
      name: recipeBookName,
      profile: profileID
    });
    if (recipeBookDocument) {
      return res.status(409).json({ err: 'Recipe Book Exists for User' });
    }
    recipeBookDocument = {
      name: recipeBookName,
      profile: profileID
    };
    try {
      recipeBookDocument = await RecipeBook.create(recipeBookDocument);
      res.status(201).json({ recipeBookDocument });
    } catch (err) {
      res.status(400).json({ err });
    }
  } catch (err) {
    return res.status(400).json({ err: 'Profile not found' });
  }
};

const addRecipeToBook = async (req, res) => {
  const recipeBookID = sanitize(req.params.recipeBookID);
  const recipeID = sanitize(req.params.recipeID);
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const recipeBookDocument = await RecipeBook.findOne({ _id: recipeBookID });
    if (recipeBookDocument.recipes.includes(recipeID)) {
      return res.status(304).json({ err: 'Recipe already exists in book' });
    }
    const recipeDocument = await Recipe.findOne({ _id: recipeID });
    recipeBookDocument.recipes.push(recipeDocument);
    await recipeBookDocument.save();
    return res.status(200).json(recipeBookDocument);
  } catch (err) {
    return res.status(500).json({ err: 'Failed to create recipe book' });
  }
};

const getRecipeBooks = async (req, res) => {
  const profileID = sanitize(req.user.profile);
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const recipeBooks = await RecipeBook.find({
      profile: profileID
    }).populate({ path: 'recipes', select: '_id title image' });
    return res.status(201).json(recipeBooks);
  } catch (err) {
    return res
      .status(409)
      .json({ err: 'Couldnt find profile and/or recipe book' });
  }
};

module.exports = {
  getRecipeBooks,
  createRecipeBook,
  addRecipeToBook
};
