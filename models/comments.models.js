const db = require('../db/connection');
const { checkExists } = require('../db/utils/query-check');

exports.removeComment = async (commentId) => {
  const result = await db.query(
    'DELETE FROM comments WHERE comment_id = $1 RETURNING *;',
    [commentId]
  );
  if (result.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: 'not found',
    });
  }
  return result.rows;
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

  const result = await db.query(
    `
  INSERT INTO comments
    (author, review_id, body)
  VALUES
    ($1, $2, $3)
  RETURNING *;
  
  `,
    [username, reviewId, body]
  );

  return result.rows;
};

exports.updateCommentById = async (commentId, inc_votes, bodyLength) => {
  // validate request body
  if (!inc_votes || bodyLength !== 1) {
    return Promise.reject({
      status: 400,
      msg: 'bad request',
    });
  }

  // update review
  await db.query(
    `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2;`,
    [inc_votes, commentId]
  );

  // query to return updated review
  const result = await db.query(
    `SELECT * FROM comments WHERE comment_id = $1;`,
    [commentId]
  );
  if (result.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: 'not found',
    });
  }
  return result.rows;
};
