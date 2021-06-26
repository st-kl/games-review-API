const { selectCategories } = require('../models/categories.models');
const {
  selectReviewById,
  updateReviewById,
  selectReviews,
  selectReviewComments,
  addReview,
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
  const newVote = req.body;
  const bodyLength = Object.keys(req.body).length;
  updateReviewById(reviewId, newVote)
    .then((reviews) => res.status(200).send({ reviews }))
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  const { sort_by, order, category, title, limit, page } = req.query;
  selectReviews(sort_by, order, category, title, limit, page)
    .then((reviews) => {
      res
        .status(200)
        .send({ reviews: reviews.rows, total_count: reviews.totalCount });
    })
    .catch(next);
};

exports.getReviewComments = (req, res, next) => {
  const reviewId = req.params.review_id;
  const { limit, page } = req.query;
  selectReviewComments(reviewId, limit, page)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postReview = (req, res, next) => {
  const newReview = req.body;
  addReview(newReview)
    .then((reviews) => res.status(201).send({ reviews }))
    .catch(next);
};
