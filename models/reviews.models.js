const db = require('../db/connection');
const { checkExists, bodyCheck } = require('../db/utils/query-check');

exports.selectReviewById = async (reviewId) => {
  const result = await db.query(
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
  if (result.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: 'not found',
    });
  }
  return result.rows;
};

exports.updateReviewById = async (reviewId, newVote) => {
  // validate request body
  if (!bodyCheck(newVote, { inc_votes: 'number' })) {
    return Promise.reject({
      status: 400,
      msg: 'bad request',
    });
  }
  const { inc_votes } = newVote;

  // update review
  await db.query(
    `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2;`,
    [inc_votes, reviewId]
  );

  // query to return updated review
  const result = await db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [
    reviewId,
  ]);
  if (result.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: 'not found',
    });
  }
  return result.rows;
};

exports.selectReviews = async (
  sort_by = 'created_at',
  order = 'desc',
  category,
  title,
  limit = 10,
  page = 1
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
    return Promise.reject({ status: 400, msg: 'invalid sort query' });
  }

  // validate order query
  if (!['asc', 'desc'].includes(order)) {
    return Promise.reject({ status: 400, msg: 'invalid order query' });
  }

  // validate limit query
  if (isNaN(limit)) {
    return Promise.reject({ status: 400, msg: 'invalid limit query' });
  }

  // validate page query
  if (isNaN(page)) {
    return Promise.reject({ status: 400, msg: 'invalid page query' });
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

  // add title to query values if provided and extend query string
  if (title) {
    if (queryValues.length) {
      queryStr += ' AND';
    } else {
      queryStr += ' WHERE';
    }
    queryValues.push(title);
    queryStr += ` reviews.title = $${queryValues.length}`;
  }

  // extend query string with group by
  queryStr += ` GROUP BY reviews.review_id`;

  // query string for totalCount query
  const totalQueryStr = queryStr.slice();

  // extend query string with order by, limit and offset
  const offset = limit * (page - 1);
  queryStr += ` ORDER BY reviews.${sort_by} ${order} LIMIT ${limit} OFFSET ${offset};`;

  // start query
  const result = await db.query(queryStr, queryValues);

  // validate categories if query returns no result
  if (result.rows.length === 0 && category) {
    await checkExists('categories', 'slug', category);
  }

  // validate titles if query returns no result
  if (result.rows.length === 0 && title) {
    await checkExists('reviews', 'title', title);
  }

  // start totalCount query
  const totalCount = await db.query(totalQueryStr, queryValues);
  result.totalCount = totalCount.rowCount;

  return result;
};

exports.selectReviewComments = async (reviewId, limit = 10, page = 1) => {
  // validate limit query
  if (isNaN(limit)) {
    return Promise.reject({ status: 400, msg: 'invalid limit query' });
  }

  // validate page query
  if (isNaN(page)) {
    return Promise.reject({ status: 400, msg: 'invalid page query' });
  }

  const offset = limit * (page - 1);

  const result = await db.query(
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
    review_id = $1
  LIMIT
    $2
  OFFSET
    $3;`,
    [reviewId, limit, offset]
  );

  // check if review exists
  if (result.rows.length === 0) {
    await checkExists('reviews', 'review_id', reviewId);
  }
  return result.rows;
};

exports.addReview = async (newReview) => {
  // validate request body
  if (
    !bodyCheck(newReview, {
      owner: 'string',
      title: 'string',
      review_body: 'string',
      designer: 'string',
      category: 'string',
    })
  ) {
    return Promise.reject({
      status: 400,
      msg: 'bad request',
    });
  }
  const { owner, title, review_body, designer, category } = newReview;

  const result = await db.query(
    `
  INSERT INTO reviews
    (owner, title, review_body, designer, category)
  VALUES
    ($1, $2, $3, $4, $5)
  RETURNING 
    owner, 
    title, 
    review_body, 
    designer, 
    category, 
    review_id,
    votes,
    created_at
  ;`,
    [owner, title, review_body, designer, category]
  );

  return result.rows;
};
