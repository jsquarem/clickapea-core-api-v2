const User = require('../models/user');
const Profile = require('../models/profile');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService.js');
const SECRET = process.env.SECRET;
const sanitize = require('mongo-sanitize');

const signup = async (req, res) => {
  const user = new User({ ...req.body });
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const profile = new Profile({
    firstName,
    lastName,
    recipes: {
      favoriteRecipes: []
    }
  });
  res.set('Access-Control-Allow-Origin', '*');
  try {
    user.profile = profile;
    profile.save();
    await user.save();
    emailService.sendSignupEmail({
      firstName,
      email
    });
    const token = createJWT(user);
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const login = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const userEmail = sanitize(req.body.email);
  try {
    const user = await User.findOne({ email: userEmail }).populate('profile');
    console.log(user, '<-user in login');

    if (!user.profile.recipes.favoriteRecipes) {
      user.profile.recipes.favoriteRecipes = [];
      await user.save();
      console.log('added favorites to profile');
    }

    if (!user) return res.status(401).json({ err: 'bad credentials' });
    // comparePassword with user Model
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch) {
        const token = createJWT(user);
        res.json({ token });
      } else {
        return res.status(401).json({ err: 'bad credentials' });
      }
    });
  } catch (err) {
    return res.status(401).json(err);
  }
};

const update = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const profileID = req.body.profileID;
  try {
    if (req.body.password !== '') {
      const user = await User.findOne({ profile: profileID });
      user.password = req.body.password;
      await user.save();
    }
    const profile = await Profile.findById(profileID);
    if (
      profile.firstName !== req.body.firstName ||
      profile.lastName !== req.body.lastName
    ) {
      profile.firstName = req.body.firstName;
      profile.lastName = req.body.lastName;
      profile.save();
    }
    return res.status(200).json(profile);
  } catch (err) {
    return res.status(401).json(err);
  }
};

//========= Helper Functions =//

const createJWT = (user) => {
  console.log(user, '<-user in createJWT');
  return jwt.sign({ user }, SECRET, { expiresIn: '24h' });
};

module.exports = {
  signup,
  login,
  update
};
