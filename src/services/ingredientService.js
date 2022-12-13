const Recipe = require('../models/recipe');

//=========== Helper functions =====================//

const capitalizeString = (string) => {
  return string
    .toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
};

const createRecipeIngredientAisle = (recipeIngredient, multiplier) => {
  return {
    aisle: recipeIngredient.aisle,
    ingredients: [createRecipeIngredientObject(recipeIngredient, multiplier)]
  };
};

const createRecipeIngredientObject = (recipeIngredient, multiplier) => {
  const titleCaseName = capitalizeString(recipeIngredient.name);
  return {
    name: titleCaseName,
    image: recipeIngredient.image,
    unitMetric: recipeIngredient.measures.metric.unitShort,
    unitUS: recipeIngredient.measures.us.unitShort,
    amountMetric: recipeIngredient.measures.metric.amount * multiplier,
    amountUS: recipeIngredient.measures.us.amount * multiplier
  };
};

const findOrCreateIngredientAisle = (
  recipeIngredient,
  ingredientsList,
  multiplier
) => {
  const i = ingredientsList.findIndex(
    (ingredient) => ingredient.aisle === recipeIngredient.aisle
  );
  // If aisle exists, check if ingredient exists in aisle
  if (i > -1) {
    const j = ingredientsList[i].ingredients.findIndex(
      (ingredient) => ingredient.name === recipeIngredient.name
    );
    // If ingredient exists in aisle, add current ingredient measurement amount to existing amount
    if (j > -1) {
      ingredientsList[i].ingredients[j].amountMetric +=
        recipeIngredient.measures.metric.amount * multiplier;
      ingredientsList[i].ingredients[j].amountUS +=
        recipeIngredient.measures.us.amount * multiplier;
    } else {
      ingredientsList[i].ingredients.push(
        createRecipeIngredientObject(recipeIngredient, multiplier)
      );
    }
  } else {
    const isValidAisle =
      recipeIngredient.aisle && recipeIngredient.aisle !== '?';
    if (isValidAisle) {
      ingredientsList.push(
        createRecipeIngredientAisle(recipeIngredient, multiplier)
      );
    }
  }
  return ingredientsList;
};

const createIngredientsList = (recipeDocuments) => {
  const multiplier = 1;
  let ingredientsList = [];
  // Loop through all recipes in list and build unique ingredient list by aisle
  recipeDocuments.forEach((recipe) => {
    recipe.extendedIngredients.forEach((recipeIngredient) => {
      ingredientsList = findOrCreateIngredientAisle(
        recipeIngredient,
        ingredientsList,
        multiplier
      );
    });
  });
  ingredientsList.sort((a, b) => (a.aisle > b.aisle ? 1 : -1));
  return ingredientsList;
};

//============ Responds to controller =================//

const getIngredientsByRecipeID = async (recipeIDs) => {
  try {
    const recipeDocuments = await Recipe.find({
      _id: {
        $in: recipeIDs
      }
    }).populate('extendedIngredients');
    const ingredientsList = createIngredientsList(recipeDocuments);
    return ingredientsList;
  } catch (err) {
    console.log(err);
    return err;
  }
};

module.exports = {
  getIngredientsByRecipeID
};
