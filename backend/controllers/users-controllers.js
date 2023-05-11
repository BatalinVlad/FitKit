const { validationResult } = require('express-validator');

//secure the password with token + salt
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//upload image
const cloudinary = require('../utils/cloudinary');
const getDataUri = require('../utils/datauri');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUserById = async (req, res, next) => {
  const userId = req.params.uid; // { rid: 'r1' }
  let user;

  try {
    user = await User.findById(userId, '-password');
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find a user', 500);
    return next(error)
  }

  if (!user) {
    const error = new HttpError('Could not find a user for the provided id.', 404);
    return next(error)
  }

  res.json(user.toObject({ getters: true })); // => { user } => { user: user }
};

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('fetching users failed, please try again late', 500)
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) })
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422))
  }

  const { name, email, password , role } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Signing up failed, Please try again later.', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError('User exists already, Please login instead.', 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('could not creat user please try again', 500);
    return next(error);
  }

  const file = req.file;
  const fileUri = getDataUri(file);

  let imagePath;

  try {
    imagePath = await cloudinary.v2.uploader.upload(fileUri.content);
  } catch (err) {
    const error = new HttpError('Upload Image failed, please try again', 500);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: {
      image_id: imagePath.public_id,
      secure_url: imagePath.secure_url
    },
    role,
    password: hashedPassword,
    likedReviews: [],
    dislikedReviews: [],
    reviews: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Singing up failed, Please try again', 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
        image: createdUser.image
      },
      'supersecret_dont_share',
      { expiresIn: '1h' });
  } catch (err) {
    const error = new HttpError('Singing up failed, Please try again', 500);
    return next(error);
  }

  res.status(201).json({
    userId: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
    userImage: createdUser.image,
    userImage: createdUser.role,
    token: token,
    likedReviews: createdUser.likedReviews,
    dislikedReviews: createdUser.dislikedReviews
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('login up failed, Please try again later.', 500);
    return next(error);
  }


  if (!existingUser) {
    const error = new HttpError('Invalid credentials, Could not log in', 403);
    return next(error);
  }

  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError('Could not log you in, please check credencials and try again', 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError('Invalid credentials, Could not log in', 403);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        image: existingUser.image,
      },
      'supersecret_dont_share',
      { expiresIn: '1h' });
  } catch (err) {
    const error = new HttpError('logging in failed, Please try again', 500);
    return next(error);
  }

  res.json({
    name: existingUser.name,
    userId: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
    userImage: existingUser.image,
    token: token,
    dislikedReviews: existingUser.dislikedReviews,
    likedReviews: existingUser.likedReviews
  });
}

exports.getUserById = getUserById;
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;

