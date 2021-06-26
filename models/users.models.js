const db = require('../db/connection');

exports.selectUsers = async () => {
  const result = await db.query('SELECT * FROM users;');
  return result.rows;
};

exports.selectUserByName = async (username) => {
  const result = await db.query('SELECT * FROM users WHERE username = $1;', [
    username,
  ]);
  if (result.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: 'not found',
    });
  }

  return result.rows;
};
