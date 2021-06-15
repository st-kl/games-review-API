const db = require('../connection');
const format = require('pg-format');
const {
  createCategoryData,
  createUserData,
  createReviewData,
  createCommentData,
} = require('../utils/data-manipulation');

const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  // drop tables
  await db.query('DROP TABLE IF EXISTS comments;');
  await db.query('DROP TABLE IF EXISTS reviews;');
  await db.query('DROP TABLE IF EXISTS users;');
  await db.query('DROP TABLE IF EXISTS categories;');

  // create categories table
  await db.query(`
    CREATE TABLE categories (
      slug VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL,
      description TEXT NOT NULL
    );`);

  // create users table
  await db.query(`
    CREATE TABLE users (
      username VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL,
      avatar_url TEXT NOT NULL,
      name VARCHAR(50) NOT NULL
    );`);

  // create reviews table
  await db.query(`
    CREATE TABLE reviews(
      review_id SERIAL PRIMARY KEY,
      title VARCHAR(250) NOT NULL,
      designer VARCHAR(250) NOT NULL,
      owner VARCHAR(200) REFERENCES users(username),
      review_img_url VARCHAR(5000) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      review_body VARCHAR(5000) NOT NULL,
      category VARCHAR(200) REFERENCES categories(slug),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      votes INT DEFAULT 0
    );`);

  // create comments table
  await db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      body TEXT NOT NULL,
      belongs_to VARCHAR(50) NOT NULL,
      created_by VARCHAR(50) REFERENCES users(username) NOT NULL,
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);

  // insert categories data
  const insertCategoryData = format(
    `
      INSERT INTO categories 
      (slug, description) 
      VALUES 
      %L
      RETURNING *;
      `,
    createCategoryData(categoryData)
  );
  await db.query(insertCategoryData);

  // insert users data
  const insertUserData = format(
    `
      INSERT INTO users 
      (username, avatar_url, name) 
      VALUES 
      %L
      RETURNING *;
      `,
    createUserData(userData)
  );
  await db.query(insertUserData);

  // insert reviews data
  const insertReviewData = format(
    `
    INSERT INTO reviews 
    (title, designer, owner, review_body, created_at, category, votes, review_img_url) 
    VALUES 
    %L 
    RETURNING *;
    `,
    createReviewData(reviewData)
  );
  const result = await db.query(insertReviewData);
  
  // insert comments data
  const insertCommentData = format(
    `
    INSERT INTO comments
    (body, belongs_to, created_by, votes, created_at)
    VALUES
    %L
    RETURNING *;
    `,
    createCommentData(commentData)
  );
  await db.query(insertCommentData);
};

module.exports = seed;
