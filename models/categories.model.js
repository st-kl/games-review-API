const db = require('../db/connection');

// Get all categories
exports.selectCategories = () => {
  return db.query('SELECT * FROM categories;').then((result) => {
    return result.rows;
  });
};
