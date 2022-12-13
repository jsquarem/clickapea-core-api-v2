const Recipe = require('../models/recipe');
const { getAllDishTypes, getDishTypeByName } = require('../services/dishTypeService')
const sanitize = require('mongo-sanitize');

const fetchDishTypesList = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const dishTypesList = await getAllDishTypes();
    res.status(201).send(dishTypesList);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const fetchDishTypeByName = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const dishTypeName = sanitize(req.params.dishTypeName);
    const dishType = await getDishTypeByName(dishTypeName);
    res.status(201).send(dishType);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

module.exports = {
  fetchDishTypesList,
  fetchDishTypeByName
};
