var ObjectId = require('mongoose').Types.ObjectId;
const { DishType } = require('../models/recipeTaxonomy');


const getAllDishTypes = async () => {
    try {
        return await DishType.find({});
    } catch (err) {
        console.log(err);
        return err;
    }
};

const getDishTypeByID = async (dishTypeID) => {
    try {
        const dishTypeDocuments = await DishType.find({
            _id: dishTypeID
        });
        return dishTypeDocuments
    } catch (err) {
        console.log(err);
        return err;
    }
};

const getDishTypeByName = async (dishTypeName) => {
    try {
        const dishTypeDocuments = await DishType.find({
            name: dishTypeName
        });
        return dishTypeDocuments
    } catch (err) {
        console.log(err);
        return err;
    }
};

const getDishTypesByNameList = async (dishTypsNameList) => {
    try {
        const dishTypesDocuments = await DishType.find({
            name: { $in: [
                dishTypsNameList
            ]}
        });
        return dishTypesDocuments
    } catch (err) {
        console.log(err);
        return err;
    }
};

module.exports = {
    getDishTypeByID,
    getAllDishTypes,
    getDishTypeByName
};
