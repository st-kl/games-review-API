const db = require('../connection');
const format = require('pg-format');
const {
  createCategoryData,
  createUserData,
  createReviewData,
<<<<<<< HEAD
} = require('../utils/data-manipulation');
=======
  createCommentData,
} = require("../utils/data-manipulation");
>>>>>>> ac6dd208b05ad4f97332c1c6b3e4f696c10e5812

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
      author VARCHAR(50) REFERENCES users(username) NOT NULL,
      review_id INT REFERENCES reviews(review_id) NOT NULL,
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      body TEXT NOT NULL
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

<<<<<<< HEAD
  // insert reviews data
  const insertReviewData = format(
    `
    INSERT INTO reviews 
    (title, designer, owner, review_img_url, review_body,  category, created_at, votes) 
    VALUES 
    %L 
    RETURNING *;
    `,
    createReviewData(reviewData)
  );
  result = await db.query(insertReviewData);
=======
      return db.query(insertUsers);
    })
    .then(() => {
      const insertReviews = format(
        `INSERT INTO reviews(title, designer, owner, review_body, created_at, category, votes, review_img_url) VALUES %L RETURNING *;`,
        createReviewData(reviewData)
      );
      //console.log(insertReviews);
      return db.query(insertReviews);
    })
    .then((result) => console.table(result.rows))
    .then(() => {
      const insertComments = format(
        `INSERT INTO comments(comment_id, author, review_id) VALUES %L RETURNING *;`,
        createCommentData(commentData)
      );
      return db.query(insertComments);
    })
    .then((result) => console.table(result.rows));
>>>>>>> ac6dd208b05ad4f97332c1c6b3e4f696c10e5812
};

module.exports = seed;
