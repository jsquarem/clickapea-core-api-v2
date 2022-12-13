# Core-API

Clickapea's core api for handling the transactional requests from the frontend.

## Getting Setup

```bash
git clone git@gitlab.com/beepbeepgo/clickapea/services/core-api.git
cd core-api
npm install
npm start
```

### Testing

- TODO

## How to use

- TODO

### Required Environment Variables

- DATABASE_URL=mongodb+srv://MONGO_URL
- NODE_MODULES_CACHE=false
- RAPIDAPI_KEY=MY_RAPIDAPI_KEY
- SECRET=IamASecret

## Features

- Import recipes from other sites
- Recipe data is downloaded and parsed, cleaned, and displayed
- 100s of sites work with the import
- Alternatively you can search the existing database of recipes
- When you find a recipe you like, you can add it to a recipebook, which will save that recipe to your account.
- You can add recipes in your account to the meal planner and/or generate a shopping list of ingredients for selected recipes

## Technologies

- Node.js
- Spoonacular API
- Express
- MongoDB with mongoose
