const db = require('../db/connection');
const { bodyCheck } = require('../db/utils/query-check');

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
  // validate request body
  if (!bodyCheck(newComment, { username: 'string', body: 'string' })) {
    return Promise.reject({
      status: 400,
      msg: 'bad request',
    });
  }
  const { username, body } = newComment;

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

exports.updateCommentById = async (commentId, newVote) => {
  // validate request body
  if (!bodyCheck(newVote, { inc_votes: 'number' })) {
    return Promise.reject({
      status: 400,
      msg: 'bad request',
    });
  }
  const { inc_votes } = newVote;

  // update comment
  await db.query(
    `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2;`,
    [inc_votes, commentId]
  );

  // query to return updated comment
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
