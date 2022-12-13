const router = require('express').Router();
const dishTypesController = require('../../controllers/dishTypes');

router.get('/dish-types', dishTypesController.fetchDishTypesList);
router.get('/dish-types/:dishTypeName', dishTypesController.fetchDishTypeByName);

module.exports = router;
