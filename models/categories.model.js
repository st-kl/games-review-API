const db = require('../db/connection');
const { checkExists } = require('../db/utils/query-check');

exports.selectCategories = async () => {
  const result = await db.query('SELECT * FROM categories;');
  return result.rows;
};

exports.selectReviewById = async (reviewId) => {
  const res = await db.query(
    `
  SELECT 
    reviews.*,
    COUNT(comments.comment_id)::INT
  FROM 
    reviews
  LEFT JOIN
    comments
  ON
    reviews.review_id = comments.review_id 
  WHERE
    reviews.review_id = $1
  GROUP BY
    reviews.review_id;`,
    [reviewId]
  );
  if (res.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: 'Not Found - ID does not exist',
    });
  }
  return res.rows;
};

exports.updateReviewById = async (reviewId, inc_votes, bodyLength) => {
  if (!inc_votes || bodyLength !== 1) {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request',
    });
  }

  await db.query(
    `
  UPDATE reviews SET votes = votes + $1 WHERE review_id = $2;
  `,
    [inc_votes, reviewId]
  );
  const res = await db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [
    reviewId,
  ]);
  if (res.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: 'Not Found - ID does not exist',
    });
  }
  return res.rows[0];
};

exports.selectReviews = async (
  sort_by = 'created_at',
  order = 'desc',
  category
) => {
  // validate sort_by query
  if (
    ![
      'owner',
      'title',
      'review_id',
      'category',
      'review_img_url',
      'created_at',
      'votes',
      'comment_count',
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: 'Invalid sort query' });
  }

  // validate order query
  if (!['asc', 'desc'].includes(order)) {
    return Promise.reject({ status: 400, msg: 'Invalid order query' });
  }

  // query arguments
  const queryValues = [];
  let queryStr = `
  SELECT 
  reviews.owner,
  reviews.title, 
  reviews.review_id,
  reviews.category,
  reviews.review_img_url,
  reviews.created_at,
  reviews.votes,
  COUNT(comments.comment_id)::INT AS comment_count
  FROM 
    reviews
  LEFT JOIN
    comments
  ON
    reviews.review_id = comments.review_id `;

  // add category to query values if provided and extend query string
  if (category) {
    queryValues.push(category);
    queryStr += ` WHERE reviews.category = $1`;
  }

  // extend query string with group by
  queryStr += ` GROUP BY reviews.review_id`;

  // extend query string with order by
  queryStr += ` ORDER BY reviews.${sort_by} ${order};`;

  const result = await db.query(queryStr, queryValues);

  // validate categories if query returns no results
  if (result.rows.length === 0) {
    await checkExists('categories', 'slug', category);
  }

  return result.rows;
};
