const db = require('../db/connection');
const { bodyCheck } = require('../db/utils/query-check');

exports.selectCategories = async () => {
  const result = await db.query('SELECT * FROM categories;');
  return result.rows;
};

exports.addCategory = async (newCategory) => {
  // validate request body
  if (
    !bodyCheck(newCategory, {
      slug: 'string',
      description: 'string',
    })
  ) {
    return Promise.reject({
      status: 400,
      msg: 'bad request',
    });
  }
  const { slug, description } = newCategory;

  const result = await db.query(
    `
  INSERT INTO categories
    (slug, description)
  VALUES
    ($1, $2)
  RETURNING *;
  `,
    [slug, description]
  );
  return result.rows;
};
