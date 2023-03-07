const express = require('express');
const { check } = require('express-validator');

const reviewsControllers = require('../controllers/reviews-controllers');
const uploadSingleImage = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth')

const router = express.Router();

router.get('/', reviewsControllers.getReviews);

router.get('/:rid', reviewsControllers.getReviewById);

router.get('/user/:uid', reviewsControllers.getReviewsByUserId);

router.use(checkAuth);

router.put(
  '/:uid/:rid/:act',
  reviewsControllers.updateReviewLikes
);

router.patch(
  '/:rid',
  [
    check('stars').not().isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  reviewsControllers.updateReview
);

router.post(
  '/',
  uploadSingleImage,
  [
    check('name').not().isEmpty(),
    check('stars').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('userImage').not().isEmpty(),
  ],
  reviewsControllers.createReview
);

router.delete('/:rid', reviewsControllers.deleteReview);

module.exports = router;
