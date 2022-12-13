const {
  addRecipeToPlannerDocument,
  getPlannerDocumentByProfileID
} = require('../services/plannerService');
const sanitize = require('mongo-sanitize');

const getPlanners = async (req, res) => {
  const profileID = sanitize(req.user.profile);
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const plannerDocuments = await getPlannerDocumentByProfileID(profileID);
    res.status(201).json(plannerDocuments);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const addRecipeToPlanner = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const input = {
      profileID: req.user.profile,
      recipeID: req.body.recipeID,
      date: req.body.date
    };
    const plannerDocument = await addRecipeToPlannerDocument(input);
    res.status(201).json(plannerDocument);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getPlanners,
  addRecipeToPlanner
};
