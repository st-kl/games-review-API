const db = require('../db/connection');

exports.selectCategories = () => {
  return db.query('SELECT * FROM categories;').then((result) => result.rows);
};

exports.selectReviewById = (reviewId) => {
  return db
    .query(
      `
  SELECT 
    reviews.*,
    COUNT(comments.comment_id)
  FROM 
    comments
  LEFT JOIN
    reviews
  ON
    comments.review_id = reviews.review_id
  WHERE
    reviews.review_id = $1
  GROUP BY
    reviews.review_id;`,
      [reviewId]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Not Found - ID does not exist',
        });
      }
      return res.rows;
    });
};

exports.updateReviewById = (reviewId, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request',
    });
  }

  return db
    .query(
      `
  UPDATE reviews SET votes = votes + $1 WHERE review_id = $2;
  `,
      [inc_votes, reviewId]
    )
    .then(() => {
      return db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [
        reviewId,
      ]);
    })
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Not Found - ID does not exist',
        });
      }
      return res.rows[0];
    });
};

exports.selectReviews = () => {
  return db
    .query(
      `
  SELECT 
  reviews.owner,
  reviews.title, 
  reviews.review_id,
  reviews.category,
  reviews.review_img_url,
  reviews.created_at,
  COUNT(comments.comment_id)::INTEGER AS comment_count
  FROM 
    comments
  LEFT JOIN
    reviews
  ON
    comments.review_id = reviews.review_id
  GROUP BY
    reviews.review_id;`
    )
    .then((result) => result.rows);
};
