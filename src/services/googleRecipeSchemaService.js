const dayjs = require('dayjs');

class GoogleRecipeSchema {
    constructor(recipe) {
      this.recipe = recipe;
    }

    async setDefaultValuesIfEmpty(param, value) {
        if (param === false || param === 0 || param === null || param === "" || param === undefined || param === -1) {
            return value;
        }
        return param
    }

    async getPublishDate() {
        return dayjs(this.recipe.createdAt).format('YYYY-MM-DD');
    }

    async getcreditsText() {
        return this.recipe.creditsText;
    }

    async getDescription() {
        return this.setDefaultValuesIfEmpty(
            this.recipe.summary, this.recipe.title);
    }

    async getTitle() {
        return this.recipe.title;
    }

    async getPrepTime() {
        return this.setDefaultValuesIfEmpty(
            this.recipe.preparationMinutes, 15);
    }

    async getCookTime() {
        return this.setDefaultValuesIfEmpty(
            this.recipe.cookingMinutes, 40);
    }

    async getTotalTime() {
        const sumTime = this.getPrepTime() + this.getCookTime()
        return this.setDefaultValuesIfEmpty(
            this.recipe.readyInMinutes, 40);
    }

    async getRatingValue() {
        return 4;
    }

    async getRatingCount() {
        return this.setDefaultValuesIfEmpty(
            this.recipe.aggregateLikes, 5);
    }

    async getServings() {
        return this.setDefaultValuesIfEmpty(
            this.recipe.servings, 6);
    }

    async getIngredients() {
        let amount = "";
        let unit = "";
        let name = "";
        let ingredients = [];
        for (let i = 0 ; i < this.recipe.extendedIngredients.length ; i++) {
            amount = this.recipe.extendedIngredients[i].amount
            unit = this.recipe.extendedIngredients[i].unit
            name = this.recipe.extendedIngredients[i].name.replace(/[)}\]]/gi, '')
            ingredients.push(`${amount} ${unit} ${name}`)
        }
        return ingredients
    }

    async getInstructions() {
        let instructions = [];
        for (let i = 0 ; i < this.recipe.analyzedInstructions.length ; i++) {
            for (let y = 0 ; y < this.recipe.analyzedInstructions[i].steps.length ; y++) {
                instructions.push(
                    {
                        "@type": "HowToStep",
                        "name": this.recipe.analyzedInstructions[i].steps[y].step,
                        "text": this.recipe.analyzedInstructions[i].steps[y].step
                    }
                )
            }
        }
        return instructions;
    }

    async getKeywords() {
        let keywordList = []
        let potentialKeyWords = [
            'vegetarian', 'vegan', 'glutenFree', 'dairyFree', 'veryHealthy',
            'cheap', 'veryPopular', 'sustainable'
        ]
        for (let i = 0 ; i < potentialKeyWords.length ; i++) {
            if (this.recipe[potentialKeyWords[i]] === true) {
                keywordList.push(potentialKeyWords[i]);
            }
        }
        console.log(keywordList)
        let keywords = keywordList.join(', ');
        return keywords;
    }

    async createGoogleRecipeSchema(recipe="") {
        if (recipe === "") {
            recipe = this.recipe;
        }
        const googleSchema = {
            '@context': 'https://schema.org/',
            '@type': 'Recipe',
            name: await this.getTitle(),
            image: [recipe.image],
            author: {
                '@type': 'Organization',
                name: await this.getcreditsText()
            },
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: await this.getRatingValue(),
                ratingCount: await this.getRatingCount()
            },
            datePublished: await this.getPublishDate(),
            description: await this.getDescription(),
            prepTime: `PT${await this.getPrepTime()}M`,
            cookTime: `PT${await this.getCookTime()}M`,
            totalTime: `PT${await this.getTotalTime()}M`,
            recipeYield: await this.getServings(),
            keywords: await this.getKeywords(),
            recipeIngredient: await this.getIngredients(),
            recipeInstructions: await this.getInstructions()
            // TODO: add additional optional values https://developers.google.com/search/docs/appearance/structured-data/recipe#recipe-properties
        };
        console.log(googleSchema);
        return googleSchema;
    }
}

module.exports = GoogleRecipeSchema;
