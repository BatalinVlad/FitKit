const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const cloudinary = require('../utils/cloudinary');
const HttpError = require('../models/http-error');
const Review = require('../models/review');
const User = require('../models/user');
const getDataUri = require('../utils/datauri');

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
    // userReviews = await Review.find({ creator: userId }); //regular method
    userReviews = await User.findById(userId).populate('reviews'); //populate method

  } catch (err) {
    const error = new HttpError('Fetching reviews failed, try again later.', 500);
    return next(error);
  }

  // if(!userReviews || userReviews.length === 0)
  if (!userReviews) {
    return next(
      new HttpError('Could not find reviews for the provided user id.', 404)
    );
  }
  //userReviews.map instead of userReviews.reviews.map
  res.json({ userReviews: userReviews.reviews.map(review => review.toObject({ getters: true })) });
};


const createReview = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  // const file = req.file;
  // const fileUri = getDataUri(file);

  // let imagePath;

  // try {
  //   imagePath = await cloudinary.v2.uploader.upload(fileUri.content);
  // } catch (err) {
  //   const error = new HttpError('Upload Image failed, please try again', 500);
  //   return next(error);
  // }

  const { name, stars, description, userImage, isGuest } = req.body;

  const createdReview = new Review({
    name,
    stars,
    description,
    userImage,
    likes: [],
    dislikes: [],
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
  // res.status(200).json({ review: review.toObject({ getters: true }) });

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

const updateReviewLikes = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const reviewId = req.params.rid;
  const userId = req.params.uid;
  const action = req.params.act;

  let review;

  try {
    review = await Review.findById(reviewId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find review', 500);
    return next(error);
  }

  let updatedReviewLikes = [...review.likes];
  let updatedReviewDislikes = [...review.dislikes];

  let user;
  try {
    user = await User.findById(userId, '-paswword');
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find user', 500);
    return next(error);
  }
  let updatedUserLikes = [...user.likedReviews];
  let updatedUserDislikes = [...user.dislikedReviews];


  const isLikedByUser = !!updatedReviewLikes.find(likeId => {
    return likeId.toString() === userId;
  });

  const isDislikedByUser = !!updatedReviewDislikes.find(dislikeId => {
    return dislikeId.toString() === userId;
  });

  if (action === 'like') {
    if (isLikedByUser) {
      updatedReviewLikes = [...updatedReviewLikes.filter(likeId => likeId.toString() !== userId)];
      updatedUserLikes = [...updatedUserLikes.filter(likedReviewId => likedReviewId.toString() !== reviewId)];
    } else {
      if (isDislikedByUser) {
        updatedReviewDislikes = [...updatedReviewDislikes.filter(dislikeId => dislikeId.toString() !== userId)];
        updatedUserDislikes = [...updatedUserDislikes.filter(dislikedReviewId => dislikedReviewId.toString() !== reviewId)];
      }
      updatedReviewLikes.push(userId);
      updatedUserLikes.push(reviewId);
    }
  } else {
    if (isDislikedByUser) {
      updatedReviewDislikes = [...updatedReviewDislikes.filter(dislikeId => dislikeId.toString() !== userId)];
      updatedUserDislikes = [...updatedUserDislikes.filter(dislikedReviewId => dislikedReviewId.toString() !== reviewId)];
    } else {
      if (isLikedByUser) {
        updatedReviewLikes = [...updatedReviewLikes.filter(likeId => likeId.toString() !== userId)];
        updatedUserLikes = [...updatedUserLikes.filter(likedReviewId => likedReviewId.toString() !== reviewId)];
      }
      updatedReviewDislikes.push(userId);
      updatedUserDislikes.push(reviewId);
    }
  }
  //update

  review.likes = [...updatedReviewLikes];
  review.dislikes = [...updatedReviewDislikes];
  user.likedReviews = [...updatedUserLikes];
  user.dislikedReviews = [...updatedUserDislikes];

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await review.save({ session: sess });
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update likes', 500);
    return next(error);
  }

  res.status(200).json({
    reviewLikes: [...updatedReviewLikes],
    reviewDislikes: [...updatedReviewDislikes],
    userLikes: [...updatedUserLikes],
    userDislikes: [...updatedUserDislikes]
  });
};

const deleteReview = async (req, res, next) => {
  const reviewId = req.params.rid;

  let review;
  try {
    review = await Review.findById(reviewId).populate('creator').populate('likes').populate('dislikes');
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

  //delete with cloadinary
  // const imagePath = review.image.image_id;

  // try {
  //   await cloudinary.uploader.destroy(imagePath, options = {
  //     folder: 'production'
  //   });
  // } catch (err) {
  //   const error = new HttpError('Something went wrong, Could not delete the image from Cloudinary', 500);
  //   return next(error);
  // }

  res.status(200).json({ messege: 'Deleted review' });
};

exports.getReviews = getReviews;
exports.getReviewById = getReviewById;
exports.getReviewsByUserId = getReviewsByUserId;
exports.createReview = createReview;
exports.updateReview = updateReview;
exports.updateReviewLikes = updateReviewLikes;
exports.deleteReview = deleteReview;
