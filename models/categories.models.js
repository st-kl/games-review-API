const db = require('../db/connection');

exports.selectCategories = async () => {
  const result = await db.query('SELECT * FROM categories;');
  return result.rows;
};
