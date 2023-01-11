require('dotenv').config();
const RecipeBook = require('../models/recipeBook');
const RecipeURL = require('../models/recipeURL');
const Profile = require('../models/profile');
const User = require('../models/user');
const Recipe = require('../models/recipe');
const RawRecipe = require('../models/rawRecipe');
const RecipeImport = require('../services/recipeImportServiceNew');
// const RapidAPIService = require('../services/rapidAPIService');
const mongoose = require('mongoose');
const profile = require('../models/profile');

const findDuplicates = (arr) => {
  let sorted_arr = arr.slice().sort();
  let results = [];
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
      results.push(sorted_arr[i]);
    }
  }
  return results;
};

const populateImportedRecipes = async (req, res) => {
  // const recipeBooks = await RecipeBook.find({});
  // const recipeProfiles = {};
  // for (const recipeBook of recipeBooks) {
  //   const profileID = recipeBook.profile;
  //   const recipes = recipeBook.recipes;
  //   for (const recipe of recipes) {
  //     recipeProfiles[recipe._id] = profileID;
  //   }
  // }
  // console.log(recipeProfiles);
  // console.log(`${Object.keys(recipeProfiles).length} Recipes owned`);
  const unownedRecipes = await Recipe.find({ owner: null });
  console.log(unownedRecipes.length);
  const user = await User.find({ email: 'j.martin0027@gmail.com' });
  console.log(user);

  try {
    let count = 1;
    for (const recipe of unownedRecipes) {
      console.log(`Updating ${recipe._id} - count ${count}`);
      const recipeObject = await Recipe.findOne({ _id: recipe._id });
      recipeObject.owner = user.profile;
      recipeObject.public = true;
      recipeObject.primeRecipe = null;
      recipeObject.save();
      count++;
    }

    res.status(201).send();
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

//populateImportedRecipes();

module.exports = {
  populateImportedRecipes
};
