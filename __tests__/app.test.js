const app = require('../app.js');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/categories', () => {
  it('200: responds with an object with categories key and array value', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.categories)).toBe(true);
      });
  });
  it('200: each category has required keys and correct value data types', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body }) => {
        body.categories.forEach((category) => {
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

describe('GET /api/reviews/:review_id', () => {
  it('200: returns a review object with the required properties ', () => {
    return request(app)
      .get('/api/reviews/2')
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        expect(body.reviews).toEqual([
          {
            review_id: 2,
            title: 'Jenga',
            designer: 'Leslie Scott',
            owner: 'philippaclaire9',
            review_img_url:
              'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            review_body: 'Fiddly fun for all the family',
            category: 'dexterity',
            created_at: '2021-01-18T10:01:41.251Z',
            votes: 5,
            count: '3',
          },
        ]);
        expect(Array.isArray(body.reviews)).toBe(true);
      });
  });
});

describe('PATCH /api/reviews/:review_id', () => {
  it('200: returns updated review object (inc)', () => {
    const incVoteBy = { inc_votes: 13 };

    return request(app)
      .patch('/api/reviews/2')
      .send(incVoteBy)
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toEqual({
          review_id: 2,
          title: 'Jenga',
          designer: 'Leslie Scott',
          owner: 'philippaclaire9',
          review_img_url:
            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
          review_body: 'Fiddly fun for all the family',
          category: 'dexterity',
          created_at: '2021-01-18T10:01:41.251Z',
          votes: 18,
        });
      });
  });
  it('200: returns updated review object (dec)', () => {
    const incVoteBy = { inc_votes: -3 };

    return request(app)
      .patch('/api/reviews/2')
      .send(incVoteBy)
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toEqual({
          review_id: 2,
          title: 'Jenga',
          designer: 'Leslie Scott',
          owner: 'philippaclaire9',
          review_img_url:
            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
          review_body: 'Fiddly fun for all the family',
          category: 'dexterity',
          created_at: '2021-01-18T10:01:41.251Z',
          votes: 2,
        });
      });
  });
});

describe.only('GET /api/reviews', () => {
  it('200: responds with an object with reviews key and array value', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.reviews)).toBe(true);
      });
  });
  it('200: each review has required keys and correct value data types', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body }) => {
        body.reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  it('200: each review has the correct number of comments', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews[0].comment_count).toBe(3);
        expect(body.reviews[1].comment_count).toBe(3);
      });
  });
});
