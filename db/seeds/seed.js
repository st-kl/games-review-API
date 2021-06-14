const db = require("../connection");
const format = require("pg-format");
const {
  createCategoryData,
  createUserData,
  createReviewData,
  createCommentData,
} = require("../utils/data-manipulation");

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  // 1. create tables
  //
  // 2. insert data
  return db
    .query("DROP TABLE IF EXISTS comments;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS reviews;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS categories;");
    })
    .then(() => {
      return db.query(`
      CREATE TABLE categories (
        slug VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL,
        description TEXT NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE users (
        username VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL,
        avatar_url TEXT NOT NULL,
        name VARCHAR(50) NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`
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
    })

    .then(() => {
      return db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR(50) REFERENCES users(username) NOT NULL,
      review_id INT REFERENCES reviews(review_id) NOT NULL,
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      body TEXT NOT NULL
    );`);
    })
    .then(() => {
      const insertCategories = format(
        `
      INSERT INTO categories 
      (slug, description) 
      VALUES %L
      RETURNING *;`,
        createCategoryData(categoryData)
      );
      return db.query(insertCategories);
    })
    .then(() => {
      const insertUsers = format(
        `
      INSERT INTO users 
      (username, avatar_url, name) 
      VALUES %L
      RETURNING *;`,
        createUserData(userData)
      );

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
};

module.exports = seed;
