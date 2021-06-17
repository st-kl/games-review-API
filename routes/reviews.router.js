const {
  getReviewById,
  patchReviewById,
  getReviews,
} = require('../controllers/categories.controller');
const reviews = require('../db/data/test-data/reviews');
const reviewsRouter = require('express').Router();

reviewsRouter.route('/').get(getReviews);

reviewsRouter.route('/:review_id').get(getReviewById).patch(patchReviewById);

module.exports = reviewsRouter;
