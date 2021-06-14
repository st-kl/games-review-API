const db = require('../connection');
const format = require('pg-format');

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  // 1. create tables
  //
  // 2. insert data
  return db
    .query('DROP TABLE IF EXISTS comments;')
    .then(() => {
      return db.query('DROP TABLE IF EXISTS reviews;');
    })
    .then(() => {
      return db.query('DROP TABLE IF EXISTS users;');
    })
    .then(() => {
      return db.query('DROP TABLE IF EXISTS categories;');
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
        CREATE TABLE reviews (
          review_id SERIAL PRIMARY KEY,
          title VARCHAR(50) NOT NULL,
          review_body TEXT NOT NULL,
          designer VARCHAR(50) NOT NULL,
          review_img_url TEXT DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
          votes INT DEFAULT 0,
          category VARCHAR(50) REFERENCES categories(slug) NOT NULL,
          owner VARCHAR(50) REFERENCES users(username) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    });
};

module.exports = seed;
