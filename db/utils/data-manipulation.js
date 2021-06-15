exports.createCategoryData = (categoryData) => {
  return categoryData.map((category) => {
    return [category.slug, category.description];
  });
};

exports.createUserData = (userData) => {
  return userData.map((user) => {
    return [user.username, user.avatar_url, user.name];
  });
};

exports.createReviewData = (reviewData) => {
  return reviewData.map((review) => {
    return [
      review.title,
      review.designer,
      review.owner,
      review.review_body,
      review.created_at,
      review.category,
      review.votes,
      review.review_img_url ||
        'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
    ];
  });
};

exports.createCommentData = (array, dic) => {
  return array.map((comment) => {
    let revRef = dic[comment.belongs_to];
    return [
      comment.created_by,
      revRef,
      comment.votes,
      comment.created_at,
      comment.body,
    ];
  });
};

exports.createRevRef = (array) => {
  const dic = {};

  if (array.length !== 0) {
    for (const comment of array) {
      dic[comment.title] = comment.review_id;
    }
  }

  return dic;
};
