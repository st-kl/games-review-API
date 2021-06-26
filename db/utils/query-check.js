const format = require('pg-format');
const db = require('../connection');

exports.checkExists = async (table, column, value) => {
  // %I is an identifier in pg-format
  const queryStr = format('SELECT * FROM %I WHERE %I = $1;', table, column);
  const dbOutput = await db.query(queryStr, [value]);

  if (dbOutput.rows.length === 0) {
    // resource does NOT exist
    return Promise.reject({ status: 404, msg: 'not found' });
  }
};

exports.bodyCheck = (body, target) => {
  Object.keys(body).forEach((key) => {
    if (!(key in Object.keys(target))) return false;
  });
  for (const prop in body) {
    if (typeof body[prop] !== target[prop]) return false;
  }
  if (Object.keys(body).length !== Object.keys(target).length) return false;

  return true;
};
