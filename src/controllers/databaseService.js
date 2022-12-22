require('dotenv').config();
const RecipeBook = require('../models/recipeBook');
const RecipeURL = require('../models/recipeURL');
const Profile = require('../models/profile');
const Recipe = require('../models/recipe');
const ImportedRecipe = require('../models/importedRecipe');
const NormalizedRecipe = require('../models/normalizedRecipe');
const importedRecipe = require('../models/importedRecipe');
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
  // console.log('here1');
  let count = 0;
  const titleArray = [];
  try {
    for await (const importedRecipe of Recipe.find({})) {
      count++;
      // console.log(importedRecipe.title, '<-importedRecipe');
      titleArray.push(importedRecipe.title);
      //console.log(count);
    }

    const duplicateRecipes = findDuplicates(titleArray);
    console.log(duplicateRecipes, '<-duplicateRecipes');
    // const importedRecipes = await Recipe.find({});
    // console.log('here3');
    console.log(count);
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
