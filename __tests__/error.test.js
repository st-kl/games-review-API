const app = require('../app.js');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');

describe('invalid url path', () => {
  test('status:404 - Not Found', () => {
    return request(app)
      .get('/anything')
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'Not Found' });
      });
  });
});
