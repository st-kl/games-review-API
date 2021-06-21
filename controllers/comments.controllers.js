const { removeComment, addComment } = require('../models/comments.models');

exports.postComment = (req, res, next) => {
  const reviewId = req.params.review_id;
  const newComment = req.body;
  addComment(reviewId, newComment)
    .then((comments) => res.status(201).send({ comments }))
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const commentId = req.params.comment_id;
  removeComment(commentId)
    .then(() => res.status(204).send())
    .catch(next);
};
