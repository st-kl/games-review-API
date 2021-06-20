const db = require('../db/connection');
const { checkExists } = require('../db/utils/query-check');

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
      msg: 'not found',
    });
  }
  return res.rows;
};

exports.updateReviewById = async (reviewId, inc_votes, bodyLength) => {
  // validate request body
  if (!inc_votes || bodyLength !== 1) {
    return Promise.reject({
      status: 400,
      msg: 'bad request',
    });
  }

  // update review
  await db.query(
    `
  UPDATE reviews SET votes = votes + $1 WHERE review_id = $2;
  `,
    [inc_votes, reviewId]
  );

  // query to return updated review
  const res = await db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [
    reviewId,
  ]);
  if (res.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: 'not found',
    });
  }
  return res.rows;
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

  // start query
  const res = await db.query(queryStr, queryValues);

  // validate categories if query returns no results
  if (res.rows.length === 0) {
    await checkExists('categories', 'slug', category);
  }

  return res.rows;
};

exports.selectReviewComments = async (reviewId) => {
  const res = await db.query(
    `
  SELECT 
    comment_id,
    votes,
    created_at,
    author,
    body
  FROM 
    comments
  WHERE
    review_id = $1;`,
    [reviewId]
  );

  if (res.rows.length === 0) {
    await checkExists('reviews', 'review_id', reviewId);
  }

  return res.rows;
};

exports.addComment = async (reviewId, newComment) => {
  const { username, body } = newComment;
  const bodyLength = Object.keys(newComment).length;

  // validate request body
  if (
    bodyLength !== 2 ||
    typeof username !== 'string' ||
    typeof body !== 'string'
  ) {
    return Promise.reject({
      status: 400,
      msg: 'bad request',
    });
  }

  // validate username
  await checkExists('users', 'username', username);

  const res = await db.query(
    `
  INSERT INTO comments
    (author, review_id, body)
  VALUES
    ($1, $2, $3)
  RETURNING *;
  
  `,
    [username, reviewId, body]
  );

  return res.rows;
};
