const express = require('express');
const {
  selectCategories,
  selectReviewById,
  updateReviewById,
  selectReviews,
} = require('../models/categories.model');

exports.getCategories = (req, res, next) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

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
