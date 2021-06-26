const { postComment } = require('../controllers/comments.controllers');
const {
  getReviews,
  getReviewById,
  patchReviewById,
  getReviewComments,
  postReview,
  deleteReview,
} = require('../controllers/reviews.controllers');
const reviewsRouter = require('express').Router();

reviewsRouter.route('/').get(getReviews).post(postReview);

reviewsRouter
  .route('/:review_id')
  .get(getReviewById)
  .patch(patchReviewById)
  .delete(deleteReview);

reviewsRouter
  .route('/:review_id/comments')
  .get(getReviewComments)
  .post(postComment);

module.exports = reviewsRouter;
