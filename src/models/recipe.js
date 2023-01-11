const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema(
  {
    primeRecipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      default: null
    },
    recipeURL: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeURL' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    public: {
      type: Boolean,
      default: true
    },
    vegetarian: {
      type: Boolean,
      default: false
    },
    vegan: {
      type: Boolean,
      default: false
    },
    glutenFree: {
      type: Boolean,
      default: false
    },
    dairyFree: {
      type: Boolean,
      default: false
    },
    veryHealthy: {
      type: Boolean,
      default: false
    },
    cheap: {
      type: Boolean,
      default: false
    },
    veryPopular: {
      type: Boolean,
      default: false
    },
    sustainable: {
      type: Boolean,
      default: false
    },
    lowFodmap: {
      type: Boolean,
      default: false
    },
    preparationMinutes: {
      type: Number,
      default: null
    },
    cookingMinutes: {
      type: Number,
      default: null
    },
    readyInMinutes: {
      type: Number,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    summary: {
      type: String,
      default: null
    },
    aggregateLikes: {
      type: Number,
      default: 0
    },
    servings: {
      type: Number,
      default: 0
    },
    extendedIngredients: [],
    equipment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }],
    cuisines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cuisine' }],
    dishTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DishType' }],
    diets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Diet' }],
    occasions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Occasion' }],
    analyzedInstructions: []
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Recipe', RecipeSchema);
