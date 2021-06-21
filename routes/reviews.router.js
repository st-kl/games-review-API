const { postComment } = require('../controllers/comments.controllers');
const {
  getReviews,
  getReviewById,
  patchReviewById,
  getReviewComments,
} = require('../controllers/reviews.controllers');
const reviews = require('../db/data/test-data/reviews');
const reviewsRouter = require('express').Router();

reviewsRouter.route('/').get(getReviews);

reviewsRouter.route('/:review_id').get(getReviewById).patch(patchReviewById);

reviewsRouter
  .route('/:review_id/comments')
  .get(getReviewComments)
  .post(postComment);

module.exports = reviewsRouter;
