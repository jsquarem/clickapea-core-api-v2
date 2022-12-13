const router = require('express').Router();
const recipeController = require('../../controllers/recipes');

router.post('/search/ingredients', recipeController.getIngredientsByRecipeIDs);

router.get('/search/new', recipeController.getNewRecipeImages);
router.get('/', recipeController.getNewRecipeImages);
router.get(
  '/search/dish-types/:dishTypeID',
  recipeController.getRecipeByDishTypeID
);
router.get('/search/dish-types', recipeController.getRecipeDishTypes);
router.get('/search/:query', recipeController.searchRecipeTitles);
router.get('/search/find/:recipeID', recipeController.getRecipeByID);

router.get(
  '/favorite/update/:recipeID/:profileID',
  recipeController.updateFavoriteRecipeByID
);

router.get('/import/:query', recipeController.getRecipeByURL);

router.post('/edit', recipeController.createNewRecipeFromEdit);

module.exports = router;
