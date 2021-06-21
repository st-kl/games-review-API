const { selectCategories } = require('../models/categories.models');
const {
  selectReviewById,
  updateReviewById,
  selectReviews,
  selectReviewComments,
} = require('../models/reviews.models');

exports.getReviewById = (req, res, next) => {
  const reviewId = req.params.review_id;
  selectReviewById(reviewId)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  const reviewId = req.params.review_id;
  const { inc_votes } = req.body;
  const bodyLength = Object.keys(req.body).length;
  updateReviewById(reviewId, inc_votes, bodyLength)
    .then((reviews) => res.status(200).send({ reviews }))
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  const { sort_by, order, category } = req.query;
  selectReviews(sort_by, order, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getReviewComments = (req, res, next) => {
  const reviewId = req.params.review_id;
  selectReviewComments(reviewId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
