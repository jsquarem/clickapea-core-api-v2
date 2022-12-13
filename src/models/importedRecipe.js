const mongoose = require('mongoose');

const importedRecipeSchema = new mongoose.Schema(
  {
    recipeURL: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipeURL' },
    recipeDataSource: { type: String, required: true },
    importedRecipeData: {}
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ImportedRecipe', importedRecipeSchema);
