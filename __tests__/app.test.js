const app = require('../app.js');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const { checkExists } = require('../db/utils/query-check.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

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

describe('GET /api/categories', () => {
  it('200: each category has required keys and correct value data types', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body }) => {
        expect(body.categories.length).toBe(4);
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
            count: 3,
          },
        ]);
        expect(Array.isArray(body.reviews)).toBe(true);
      });
  });
  it('404: Not Found - ID does not exist', () => {
    return request(app)
      .get('/api/reviews/14')
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'Not Found - ID does not exist' });
      });
  });
  it('400: Bad Request', () => {
    return request(app)
      .get('/api/reviews/elephant')
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: 'Bad Request',
        });
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
  it('404: Not Found - ID does not exist', () => {
    const incVoteBy = { inc_votes: 13 };

    return request(app)
      .patch('/api/reviews/14')
      .send(incVoteBy)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'Not Found - ID does not exist' });
      });
  });
  it('400: Bad Request - invalid ID', () => {
    const incVoteBy = { inc_votes: 13 };

    return request(app)
      .patch('/api/reviews/elephant')
      .send(incVoteBy)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'Bad Request' });
      });
  });
  it('400: Bad Request - invalid vote value', () => {
    const incVoteBy = { inc_votes: 'test' };

    return request(app)
      .patch('/api/reviews/2')
      .send(incVoteBy)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'Bad Request' });
      });
  });
  it('400: Bad Request - invalid body (wrong key)', () => {
    const incVoteBy = { inc: 13 };

    return request(app)
      .patch('/api/reviews/2')
      .send(incVoteBy)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: 'Bad Request',
        });
      });
  });
  it('400: Bad Request - invalid body (empty body)', () => {
    const incVoteBy = {};

    return request(app)
      .patch('/api/reviews/2')
      .send(incVoteBy)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: 'Bad Request',
        });
      });
  });
  it('400: Bad Request - invalid body (too many keys)', () => {
    const incVoteBy = { inc_votes: 1, name: 'Mitch' };

    return request(app)
      .patch('/api/reviews/2')
      .send(incVoteBy)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: 'Bad Request',
        });
      });
  });
});

describe('GET /api/reviews', () => {
  it('200: responds with an object with reviews key and array value', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.reviews)).toBe(true);
        expect(body.reviews.length).toBe(13);
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
              votes: expect.any(Number),
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
        body.reviews.forEach((review) => {
          if (review.slug === 'Jenga') {
            expect(review.comment_count).toBe(3);
          } else if (review.slug === 'Agricola') {
            expect(review.comment_count).toBe(0);
          }
        });
      });
  });
  it('200: returns reviews sorted by date by default', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy('created_at', {
          descending: true,
        });
      });
  });
  // it('200: returns reviews sorted by query value', () => {
  //   return request(app)
  //     .get('/api/reviews?sort_by=title')
  //     .expect(200)
  //     .then(({ body }) => {
  //       console.log(body.reviews);
  //       expect(body.reviews).toBeSortedBy('title', {
  //         descending: true,
  //       });
  //     });
  // });
  it('200: returns reviews sorted by query value in asc order', () => {
    return request(app)
      .get('/api/reviews?sort_by=review_id&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy('review_id');
      });
  });
  it('200: returns reviews sorted by query value in desc order', () => {
    return request(app)
      .get('/api/reviews?sort_by=review_id&order=desc')
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy('review_id', {
          descending: true,
        });
      });
  });
  it('200: returns reviews filtered by category in query', () => {
    return request(app)
      .get('/api/reviews?category=dexterity')
      .then(({ body }) => {
        body.reviews.forEach((review) =>
          expect(review.category).toBe('dexterity')
        );
      });
  });
  it('200: returns no reviews if category exists but no reviews with that category', () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .then(({ body }) => {
        expect(body.reviews.length).toBe(0);
      });
  });
  it('400: Invalid sort query', () => {
    return request(app)
      .get('/api/reviews?sort_by=elephant')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid sort query');
      });
  });
  it('400: Invalid order query', () => {
    return request(app)
      .get('/api/reviews?sort_by=review_id&order=ascending')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid order query');
      });
  });
  it('400: Invalid category query', () => {
    return request(app)
      .get('/api/reviews?category=hitandrun')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('resource does not exist');
      });
  });
});

describe('checkExists', () => {
  it('400: resource does not exists', () => {
    const input = ['categories', 'slug', 'strategy'];

    return checkExists(...input).catch((err) =>
      expect(err.msg).toBe('resource does not exist')
    );
  });
  it('resource does exists', () => {
    const input = ['categories', 'slug', 'euro game'];

    return checkExists(...input).then((res) => {
      expect(res).toBe(undefined);
    });
  });
});

describe('/api/reviews/:review_id/comments', () => {});
