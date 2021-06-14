// extract any functions you are using to manipulate your data, into this file

exports.createCategoryData = (array) => {
  return array.map((category) => {
    return [category.slug, category.description];
  });
};

exports.createUserData = (array) => {
  return array.map((user) => {
    return [user.username, user.avatar_url, user.name];
  });
};

exports.createReviewData = (array) => {
  return array.map((review) => {
    return [
      review.title,
      review.designer,
      review.owner,
      review.review_body,
      review.created_at,
      review.category,
      review.votes,
      review.review_img_url,
    ];
  });
};

/* exports.createCommentData = (array) => {
    return array.map((comment) => {
      return [comment.comment_id, comment.author, comment.review_id, ];
    });
  }; */
