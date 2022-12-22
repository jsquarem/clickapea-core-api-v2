const express = require('express');
const router = express.Router();
const databaseCtrl = require('../../controllers/databaseService.js');

router.get('/populate', databaseCtrl.populateImportedRecipes);

module.exports = router;
