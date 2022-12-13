const Equipment = require('../models/equipment');
const Ingredient = require('../models/ingredient');
const {
  Cuisine,
  DishType,
  Diet,
  Occasion
} = require('../models/recipeTaxonomy');

class ImportedRecipe {
  constructor(recipeData, recipeURLDocument, recipeDataSource) {
    this.recipeData = recipeData;
    this.recipeURLDocument = recipeURLDocument;
    this.recipeDataSource = recipeDataSource;
  }

  async generateRecipeObject() {
    return {
      recipeURL: this.recipeURLDocument,
      recipeDataSource: this.recipeDataSource,
      importedRecipeData: this.recipeData
      
    };
  }

  async createNormalizedRecipeDocument(recipeData, profileID) {
    return {
      primeRecipe: null,
      owner: profileID,
      public: false,
      vegetarian: this.recipeData.vegetarian,
      vegan: this.recipeData.vegan,
      glutenFree: this.recipeData.glutenFree,
      dairyFree: this.recipeData.dairyFree,
      veryHealthy: this.recipeData.veryHealthy,
      cheap: this.recipeData.cheap,
      veryPopular: this.recipeData.veryPopular,
      sustainable: this.recipeData.sustainable,
      lowFodmap: this.recipeData.lowFodmap,
      preparationMinutes: this.recipeData.preparationMinutes,
      cookingMinutes: this.recipeData.cookingMinutes,
      readyInMinutes: this.recipeData.readyInMinutes,
      title: this.recipeData.title,
      extendedIngredients: this.recipeData.extendedIngredients,
      analyzedInstructions: this.recipeData.analyzedInstructions,
      equipment: await this.findOrCreateEquipment(
        this.recipeData.analyzedInstructions
      ),
      cuisines: await this.findOrCreateCuisines(this.recipeData.cuisines),
      dishTypes: await this.findOrCreateDishTypes(this.recipeData.dishTypes),
      diets: await this.findOrCreateDiets(this.recipeData.diets),
      occasions: await this.findOrCreateOccasions(this.recipeData.occasions)
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
