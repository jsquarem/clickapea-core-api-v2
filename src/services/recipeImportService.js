const Equipment = require('../models/equipment');
const Ingredient = require('../models/ingredient');
const {
  Cuisine,
  DishType,
  Diet,
  Occasion
} = require('../models/recipeTaxonomy');

class ImportedRecipe {
  constructor(recipeData, recipeURLDocument) {
    this.recipeData = recipeData;
    this.recipeURLDocument = recipeURLDocument;
  }

  async generateRecipeObject() {
    return {
      recipeURL: this.recipeURLDocument,
      privacy: {
        public: true,
        owner: null
      },
      equipment: await this.findOrCreateEquipment(
        this.recipeData.analyzedInstructions
      ),
      cuisines: await this.findOrCreateCuisines(this.recipeData.cuisines),
      dishTypes: await this.findOrCreateDishTypes(this.recipeData.dishTypes),
      diets: await this.findOrCreateDiets(this.recipeData.diets),
      occasions: await this.findOrCreateOccasions(this.recipeData.occasions),
      ingredients: await this.findOrCreateIngredients(
        this.recipeData.extendedIngredients
      ),
      extendedIngredients: this.recipeData.extendedIngredients,
      vegetarian: this.recipeData.vegetarian,
      vegan: this.recipeData.vegan,
      glutenFree: this.recipeData.glutenFree,
      dairyFree: this.recipeData.dairyFree,
      veryHealthy: this.recipeData.veryHealthy,
      cheap: this.recipeData.cheap,
      veryPopular: this.recipeData.veryPopular,
      sustainable: this.recipeData.sustainable,
      lowFodmap: this.recipeData.lowFodmap,
      weightWatcherSmartPoints: this.recipeData.weightWatcherSmartPoints,
      gaps: this.recipeData.gaps,
      preparationMinutes: this.recipeData.preparationMinutes,
      cookingMinutes: this.recipeData.cookingMinutes,
      aggregateLikes: this.recipeData.aggregateLikes,
      readyInMinutes: this.recipeData.readyInMinutes,
      healthScore: this.recipeData.healthScore,
      creditsText: this.recipeData.creditsText,
      sourceName: this.recipeData.sourceName,
      pricePerServing: this.recipeData.pricePerServing,
      id: this.recipeData.id,
      title: this.recipeData.title,
      servings: this.recipeData.servings,
      sourceUrl: this.recipeData.sourceUrl,
      image: this.recipeData.image,
      imageType: this.recipeData.imageType,
      summary: this.recipeData.summary,
      instructions: this.recipeData.instructions,
      taste: this.recipeData.taste,
      analyzedInstructions: this.recipeData.analyzedInstructions
    };
  }

  async findOrCreateEquipment(analyzedInstructionRaws) {
    const equipmentDocumentsRaw = [];
    for (const instruction of analyzedInstructionRaws[0].steps) {
      if (!instruction.equipment) continue;
      for (const equipment of instruction.equipment) {
        let equipmentDocument = await Equipment.findOne({ id: equipment.id });
        if (!equipmentDocument) {
          equipmentDocument = await Equipment.create(equipment);
        }
        equipmentDocumentsRaw.push(equipmentDocument);
      }
    }
    const uniqueIds = [];
    const equipmentDocuments = equipmentDocumentsRaw.filter((equipment) => {
      const isDuplicate = uniqueIds.includes(equipment.id);
      if (!isDuplicate) {
        uniqueIds.push(equipment.id);
        return true;
      }
      return false;
    });
    return equipmentDocuments;
  }

  async findOrCreateOccasions(occasionRaws) {
    const occasionDocuments = [];
    for (const occasion of occasionRaws) {
      let occasionDocument = await Occasion.findOne({ name: occasion });
      if (!occasionDocument) {
        occasionDocument = await Occasion.create({ name: occasion });
      }
      occasionDocuments.push(occasionDocument);
    }
    return occasionDocuments;
  }

  async findOrCreateDiets(dietRaws) {
    const dietDocuments = [];
    for (const diet of dietRaws) {
      let dietDocument = '';
      dietDocument = await Diet.findOne({ name: diet });
      if (!dietDocument) {
        dietDocument = await Diet.create({ name: diet });
      }
      dietDocuments.push(dietDocument);
    }
    return dietDocuments;
  }

  async findOrCreateDishTypes(dishTypeRaws) {
    const dishTypeDocuments = [];
    for (const dishType of dishTypeRaws) {
      let dishTypeDocument = '';
      dishTypeDocument = await DishType.findOne({ name: dishType });
      if (!dishTypeDocument) {
        dishTypeDocument = await DishType.create({ name: dishType });
      }
      dishTypeDocuments.push(dishTypeDocument);
    }
    return dishTypeDocuments;
  }

  async findOrCreateCuisines(cuisineRaws) {
    const cuisineDocuments = [];
    for (const cuisine of cuisineRaws) {
      let cuisineDocument = '';
      cuisineDocument = await Cuisine.findOne({ name: cuisine });
      if (!cuisineDocument) {
        cuisineDocument = await Cuisine.create({ name: cuisine });
      }
      cuisineDocuments.push(cuisineDocument);
    }
    return cuisineDocuments;
  }

  async findOrCreateIngredients(extendedIngredientsRaw) {
    const ingredientDocuments = [];
    for (const extendedIngredient of extendedIngredientsRaw) {
      let ingredientObj = {
        id: extendedIngredient.id,
        aisle: extendedIngredient.aisle,
        image: extendedIngredient.image,
        consistency: extendedIngredient.consistency,
        name: extendedIngredient.name
      };
      let ingredientDocument = await Ingredient.findOne({
        id: extendedIngredient.id
      });
      if (!ingredientDocument) {
        ingredientDocument = await Ingredient.create(ingredientObj);
      }
      ingredientDocuments.push(ingredientDocument);
    }
    return ingredientDocuments;
  }
}

module.exports = ImportedRecipe;
