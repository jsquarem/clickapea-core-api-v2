const mongoose = require('mongoose');

const rawRecipeSchema = new mongoose.Schema(
  {
    recipeURL: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeURL' },
    recipeSource: {
      type: String,
      default: null
    },
    recipeDump: {}
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('RawRecipe', rawRecipeSchema);
