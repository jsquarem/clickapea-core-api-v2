const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

class RapidAPIService {
  constructor(apiKey, baseURL, logger) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.logger = logger;
  }
  /**
   * @param  {string} url - Recipe URL to query
   * @param  {object} result - Recipe Data
   */
  async fetchRecipe(url) {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': this.apiKey,
        'X-RepidAPI-Host': this.baseURL
      }
    };
    const extractAPIURL = `https://${this.baseURL}/recipes/extract?analyze=true&includeTaste=true`;
    const recipeRequestURL = `${extractAPIURL}&url=${url}`;
    const result = await fetch(recipeRequestURL, options);
    return result.json();
  }
}

module.exports = RapidAPIService;
