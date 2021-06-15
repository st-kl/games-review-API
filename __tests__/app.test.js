const app = require('../app.js');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/categories', () => {
  test('return /categories, status:200 - responds with array of categories', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });
  test('status:200, each category has required keys and correct value data types', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body }) => {
        body.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});
