const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Review = require('../models/review');
const User = require('../models/user');

const getReviews = async (req, res, next) => {
  let reviews;
  try {
    reviews = await Review.find();
  } catch (err) {
    const error = new HttpError('fetching reviews failed, please try again later', 500)
    return next(error);
  }
  res.json({ loadedReviews: reviews.map(review => review.toObject({ getters: true })) })
};

const getReviewById = async (req, res, next) => {
  const reviewId = req.params.rid; // { rid: 'r1' }
  let review;

  try {
    review = await Review.findById(reviewId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find a review', 500);
    return next(error)
  }

  if (!review) {
    const error = new HttpError('Could not find a review for the provided id.', 404);
    return next(error)
  }

  res.json({ review: review.toObject({ getters: true }) }); // => { review } => { review: review }
};

const getReviewsByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userReviews;

  try {
    userReviews = await User.findById(userId).populate('reviews'); //populate method

  } catch (err) {
    const error = new HttpError('Fetching reviews failed, try again later.', 500);
    return next(error);
  }

  if (!userReviews) {
    return next(
      new HttpError('Could not find reviews for the provided user id.', 404)
    );
  }
  res.json({ userReviews: userReviews.reviews.map(review => review.toObject({ getters: true })) });
};


const createReview = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { name, stars, description, userImage, isGuest } = req.body;

  const createdReview = new Review({
    name,
    stars,
    description,
    userImage,
    isGuest,
    creator: req.userData.userId
  });

  let user;
  try {
    if (!createdReview.isGuest) {
      user = await User.findById(req.userData.userId);
    }
  } catch (err) {
    const error = new HttpError('Creating review failed, please try again', 500);
    return next(error);
  }
  try {
    if (createdReview.isGuest) {
      await createdReview.save();
    }
    else {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdReview.save({ session: sess });

      user.reviews.push(createdReview);
      await user.save({ session: sess });
      await sess.commitTransaction();
    }
  } catch {
    const error = new HttpError('Creating Review failed, Please try again.', 500);
    return next(error);
  }

  res.status(201).json({ review: createdReview.toObject({ getters: true }) });
};

const updateReview = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { stars, description } = req.body;
  const reviewId = req.params.rid;

  let review;
  try {
    review = await Review.findById(reviewId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update review', 500);
    return next(error);
  }

  if (review.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      'you are not allowed to edit this review.', 401
    )
    return next(error);
  }

  review.stars = stars;
  review.description = description;

  try {
    await review.save();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update review', 500);
    return next(error);
  }

  res.status(200).json({ review: review.toObject({ getters: true }) });
};

const deleteReview = async (req, res, next) => {
  const reviewId = req.params.rid;

  let review;
  try {
    review = await Review.findById(reviewId).populate('creator');
  } catch (err) {
    const error = new HttpError('Something went wrong, Could not delete the review', 500);
    return next(error);
  }

  if (!review) {
    const error = new HttpError('Could not fint review for this id', 403);
    return next(error);
  }

  if (review.creator.id !== req.userData.userId) {
    const error = new HttpError(
      'you are not allowed to delete this review.', 401
    )
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await review.remove({ session: sess });
    await review.creator.reviews.pull(review);

    await review.creator.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError('Something went wrong, Could not delete the review', 500);
    return next(error);
  }
  res.status(200).json({ messege: 'Deleted review' });
};

exports.getReviews = getReviews;
exports.getReviewById = getReviewById;
exports.getReviewsByUserId = getReviewsByUserId;
exports.createReview = createReview;
exports.updateReview = updateReview;
exports.deleteReview = deleteReview;
