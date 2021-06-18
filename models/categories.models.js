const db = require('../db/connection');
const { checkExists } = require('../db/utils/query-check');

exports.selectCategories = async () => {
  const result = await db.query('SELECT * FROM categories;');
  return result.rows;
};
