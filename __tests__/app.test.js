const app = require('../app.js');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const { checkExists } = require('../db/utils/query-check.js');
const { apiInfo } = require('../controllers/api.controllers.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('invalid url path', () => {
  test('status:404 - not found', () => {
    return request(app)
      .get('/anything')
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'not found' });
      });
  });
});

describe('GET /api', () => {
  it('200: returns JSON describing all available endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => expect(body).toEqual({ apiInfo }));
  });
});

describe('GET /api/reviews', () => {
  it('200: responds with array of objects with reviews key', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.reviews)).toBe(true);
        expect(body.reviews.length).toBe(10);
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
        expect(body.reviews.length).toBe(1);
        body.reviews.forEach((review) =>
          expect(review.category).toBe('dexterity')
        );
      });
  });
  it('200: returns reviews filtered by title in query', () => {
    return request(app)
      .get('/api/reviews?title=Dolor reprehenderit')
      .then(({ body }) => {
        expect(body.reviews.length).toBe(1);
        body.reviews.forEach((review) =>
          expect(review.title).toBe('Dolor reprehenderit')
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
  it('400: invalid sort query', () => {
    return request(app)
      .get('/api/reviews?sort_by=elephant')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('invalid sort query');
      });
  });
  it('400: invalid order query', () => {
    return request(app)
      .get('/api/reviews?sort_by=review_id&order=ascending')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('invalid order query');
      });
  });
  it('400: invalid category query', () => {
    return request(app)
      .get('/api/reviews?category=hitandrun')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('not found');
      });
  });
  it('400: invalid title query', () => {
    return request(app)
      .get('/api/reviews?title=newTitle')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('not found');
      });
  });
});

describe('POST /api/reviews', () => {
  it('201: returns posted comment', () => {
    return request(app)
      .post('/api/reviews')
      .send({
        owner: 'bainesface',
        title: 'new game',
        review_body: 'review body',
        designer: 'Mario',
        category: 'euro game',
      })
      .expect(201)
      .then(({ body }) => {
        expect(Array.isArray(body.reviews)).toBe(true);
        expect(body.reviews.length).toBe(1);
        expect(body.reviews[0]).toEqual({
          review_id: 14,
          votes: 0,
          created_at: expect.any(String),
          owner: 'bainesface',
          title: 'new game',
          review_body: 'review body',
          designer: 'Mario',
          category: 'euro game',
        });
      });
  });
  it('404: not found - owner does not exist', () => {
    return request(app)
      .post('/api/reviews')
      .send({
        owner: 'robin',
        title: 'new game',
        review_body: 'review body',
        designer: 'Mario',
        category: 'euro game',
      })
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'not found' });
      });
  });
  it('404: not found - category does not exist', () => {
    return request(app)
      .post('/api/reviews')
      .send({
        owner: 'robin',
        title: 'new game',
        review_body: 'review body',
        designer: 'Mario',
        category: 'hitandrun',
      })
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'not found' });
      });
  });
  it('400: bad request - wrong number of keys in body', () => {
    return request(app)
      .post('/api/reviews')
      .send({
        owner: 'robin',
        title: 'new game',
        review_body: 'review body',
        designer: 'Mario',
        category: 'hitandrun',
        body: 'body text',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
  it('400: bad request - wrong key in body', () => {
    return request(app)
      .post('/api/reviews')
      .send({
        owner: 'robin',
        title: 'new game',
        review_body: 'review body',
        designer: 'Mario',
        categories: 'hitandrun',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
  it('400: bad request - wrong value data type', () => {
    return request(app)
      .post('/api/reviews')
      .send({
        owner: 'robin',
        title: 'new game',
        review_body: 'review body',
        designer: 'Mario',
        category: 13,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
});

describe('GET /api/reviews/:review_id', () => {
  it('200: returns an array with review object with the required properties ', () => {
    return request(app)
      .get('/api/reviews/2')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.reviews)).toBe(true);
        expect(body.reviews.length).toBe(1);
        expect(body.reviews[0]).toEqual({
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
        });
      });
  });
  it('404: not found - ID does not exist', () => {
    return request(app)
      .get('/api/reviews/14')
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'not found' });
      });
  });
  it('400: bad request - review ID not a number', () => {
    return request(app)
      .get('/api/reviews/elephant')
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: 'bad request',
        });
      });
  });
});

describe('PATCH /api/reviews/:review_id', () => {
  it('200: returns an array with the updated review object (inc)', () => {
    return request(app)
      .patch('/api/reviews/2')
      .send({ inc_votes: 13 })
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.reviews)).toBe(true);
        expect(body.reviews.length).toBe(1);
        expect(body.reviews[0]).toEqual({
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
  it('200: returns an array with the updated review object (dec)', () => {
    return request(app)
      .patch('/api/reviews/2')
      .send({ inc_votes: -3 })
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.reviews)).toBe(true);
        expect(body.reviews.length).toBe(1);
        expect(body.reviews[0]).toEqual({
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
  it('404: not found - ID does not exist', () => {
    return request(app)
      .patch('/api/reviews/14')
      .send({ inc_votes: 13 })
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'not found' });
      });
  });
  it('400: bad request - invalid ID', () => {
    return request(app)
      .patch('/api/reviews/elephant')
      .send({ inc_votes: 13 })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
  it('400: bad request - invalid vote value', () => {
    return request(app)
      .patch('/api/reviews/2')
      .send({ inc_votes: 'test' })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
  it('400: bad request - invalid body (wrong key)', () => {
    return request(app)
      .patch('/api/reviews/2')
      .send({ inc: 13 })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: 'bad request',
        });
      });
  });
  it('400: bad request - invalid body (too many keys)', () => {
    return request(app)
      .patch('/api/reviews/2')
      .send({ inc_votes: 1, name: 'Mitch' })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: 'bad request',
        });
      });
  });
});

describe('DELETE /api/reviews/:review_id', () => {
  it('204: deletes review from database', () => {
    return request(app).delete('/api/reviews/2').expect(204);
  });
  it('404: not found - ID does not exist', () => {
    return request(app)
      .delete('/api/reviews/30')
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'not found' });
      });
  });
  it('400: bad request - ID invalid', () => {
    return request(app)
      .delete('/api/reviews/elephant')
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
});

describe('GET /api/categories', () => {
  it('200: each category has required keys, correct value data types and number of items', () => {
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

describe('POST /api/categories', () => {
  it('201: returns posted category', () => {
    return request(app)
      .post('/api/categories')
      .send({
        slug: 'luck',
        description: 'Games without strategy',
      })
      .expect(201)
      .then(({ body }) => {
        expect(Array.isArray(body.categories)).toBe(true);
        expect(body.categories.length).toBe(1);
        expect(body.categories[0]).toEqual({
          slug: 'luck',
          description: 'Games without strategy',
        });
      });
  });
  it('400: bad request - category already exists', () => {
    return request(app)
      .post('/api/categories')
      .send({
        slug: 'dexterity',
        description: 'Games involving physical skill',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
  it('400: bad request - wrong number of keys in body', () => {
    return request(app)
      .post('/api/categories')
      .send({
        slug: 'luck',
        description: 'Games without strategy',
        id: 8,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
  it('400: bad request - wrong key in body', () => {
    return request(app)
      .post('/api/categories')
      .send({
        slug: 'luck',
        descriptions: 'Games without strategy',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
  it('400: bad request - wrong value data type', () => {
    return request(app)
      .post('/api/categories')
      .send({
        slug: 'luck',
        description: 20,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
});

describe('GET /api/reviews/:review_id/comments', () => {
  it('200: returns an array of comment objects if comments exist', () => {
    return request(app)
      .get('/api/reviews/2/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(3);
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  it('200: returns an empty array of comments if no comment exists', () => {
    return request(app)
      .get('/api/reviews/4/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(0);
      });
  });
  it('404: not found - ID does not exist', () => {
    return request(app)
      .get('/api/reviews/14/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'not found' });
      });
  });
  it('400: not found - ID invalid', () => {
    return request(app)
      .get('/api/reviews/elephant/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
});

describe('POST /api/reviews/:review_id/comments', () => {
  it('200: returns posted comment ', () => {
    return request(app)
      .post('/api/reviews/1/comments')
      .send({ username: 'bainesface', body: 'new comment' })
      .expect(201)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBe(1);
        expect(body.comments[0]).toEqual({
          comment_id: 7,
          author: 'bainesface',
          review_id: 1,
          votes: 0,
          created_at: expect.any(String),
          body: 'new comment',
        });
      });
  });
  it('404: not found - ID does not exist', () => {
    return request(app)
      .post('/api/reviews/14/comments')
      .send({ username: 'bainesface', body: 'new comment' })
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'not found' });
      });
  });
  it('400: bad request - ID invalid', () => {
    return request(app)
      .post('/api/reviews/elephant/comments')
      .send({ username: 'bainesface', body: 'new comment' })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
  it('404: not found - username does not exist', () => {
    return request(app)
      .post('/api/reviews/1/comments')
      .send({ username: 'notauser', body: 'new comment' })
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'not found' });
      });
  });
  it('400: bad request - wrong number of keys in body', () => {
    return request(app)
      .post('/api/reviews/1/comments')
      .send({ username: 'bainesface', body: 'new comment', name: 'mitch' })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
  it('400: bad request - wrong username data type', () => {
    return request(app)
      .post('/api/reviews/1/comments')
      .send({ username: 7, body: 'new comment' })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
  it('400: bad request - wrong body data type', () => {
    return request(app)
      .post('/api/reviews/1/comments')
      .send({ username: 'bainesface', body: 8 })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
  it('400: bad request - wrong username key', () => {
    return request(app)
      .post('/api/reviews/1/comments')
      .send({ user: 'bainesface', body: 'new comment' })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
  it('400: bad request - wrong body key', () => {
    return request(app)
      .post('/api/reviews/1/comments')
      .send({ username: 'bainesface', bo: 'new comment' })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
});

describe('PATCH /api/comments/:comment_id', () => {
  it('200: returns an array with the updated comment object (inc)', () => {
    return request(app)
      .patch('/api/comments/6')
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBe(1);
        expect(body.comments[0]).toEqual({
          comment_id: 6,
          author: 'philippaclaire9',
          review_id: 3,
          votes: 11,
          created_at: '2021-03-27T19:49:48.110Z',
          body: 'Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite',
        });
      });
  });
  it('200: returns an array with the updated comment object (dec)', () => {
    return request(app)
      .patch('/api/comments/6')
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBe(1);
        expect(body.comments[0]).toEqual({
          comment_id: 6,
          author: 'philippaclaire9',
          review_id: 3,
          votes: 9,
          created_at: '2021-03-27T19:49:48.110Z',
          body: 'Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite',
        });
      });
  });
  it('404: not found - ID does not exist', () => {
    return request(app)
      .patch('/api/comments/14')
      .send({ inc_votes: 13 })
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'not found' });
      });
  });
  it('400: bad request - invalid ID', () => {
    return request(app)
      .patch('/api/comments/elephant')
      .send({ inc_votes: 13 })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
  it('400: bad request - invalid vote value', () => {
    return request(app)
      .patch('/api/comments/2')
      .send({ inc_votes: 'test' })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
  it('400: bad request - invalid body (wrong key)', () => {
    return request(app)
      .patch('/api/comments/2')
      .send({ inc: 13 })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: 'bad request',
        });
      });
  });
  it('400: bad request - invalid body (too many keys)', () => {
    return request(app)
      .patch('/api/comments/2')
      .send({ inc_votes: 1, name: 'Mitch' })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: 'bad request',
        });
      });
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  it('204: deletes comment from database', () => {
    return request(app).delete('/api/comments/2').expect(204);
  });
  it('404: not found - ID does not exist', () => {
    return request(app)
      .delete('/api/comments/30')
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'not found' });
      });
  });
  it('400: bad request - ID invalid', () => {
    return request(app)
      .delete('/api/comments/elephant')
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'bad request' });
      });
  });
});

describe('GET /api/users', () => {
  it('200: each user has required keys, correct value data types and number of items', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe('GET /api/users/:username', () => {
  it('200: returns an array with user object with the required properties', () => {
    return request(app)
      .get('/api/users/dav3rid')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length).toBe(1);
        expect(body.users[0]).toEqual({
          username: 'dav3rid',
          name: 'dave',
          avatar_url:
            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        });
      });
  });
  it('404: not found - name does not exist', () => {
    return request(app)
      .get('/api/users/jack')
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'not found' });
      });
  });
});

describe('PAGINATION', () => {
  describe('GET /api/reviews', () => {
    it('200: returns only 10 reviews by default', () => {
      return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({ body }) => expect(body.reviews).toHaveLength(10));
    });
    it('200: returns number of reviews specified by limit in query', () => {
      return request(app)
        .get('/api/reviews?limit=2')
        .expect(200)
        .then(({ body }) => expect(body.reviews).toHaveLength(2));
    });
    it('400: returns error message if limit query is invalid', () => {
      return request(app)
        .get('/api/reviews?limit=droptable')
        .expect(400)
        .then(({ body }) => expect(body.msg).toBe('invalid limit query'));
    });
    it('200: returns second n (=default limit) results for page query', () => {
      return request(app)
        .get('/api/reviews?page=2&sort_by=review_id&order=asc')
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toHaveLength(3);
          body.reviews.forEach((review, index) => {
            expect(review.review_id).toBe(index + 11);
          });
        });
    });
    it('200: returns results based on set limit and page', () => {
      return request(app)
        .get('/api/reviews?page=5&limit=2&sort_by=review_id&order=asc')
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toHaveLength(2);
          expect(body.reviews[0].review_id).toBe(9);
          expect(body.reviews[1].review_id).toBe(10);
        });
    });
    it('400: returns error message if page query is invalid', () => {
      return request(app)
        .get('/api/reviews?page=droptable')
        .expect(400)
        .then(({ body }) => expect(body.msg).toBe('invalid page query'));
    });
    it('200: returns reviews with an additional count property', () => {
      return request(app)
        .get('/api/reviews?page=5&limit=2')
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty('total_count', 13);
        });
    });
    it('200: returns 0 reviews as total_count', () => {
      return request(app)
        .get("/api/reviews?page=5&limit=2&category=children's games")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty('total_count', 0);
        });
    });
  });

  describe('GET /api/reviews/:review_id/comments', () => {
    it('200: returns only 10 reviews by default', () => {
      return request(app)
        .get('/api/reviews/2/comments')
        .expect(200)
        .then(({ body }) => expect(body.comments).toHaveLength(3));
    });

    it('200: returns number of comments specified by limit in query', () => {
      return request(app)
        .get('/api/reviews/2/comments?limit=2')
        .expect(200)
        .then(({ body }) => expect(body.comments).toHaveLength(2));
    });
    it('400: returns error message if limit query is invalid', () => {
      return request(app)
        .get('/api/reviews/2/comments?limit=droptable')
        .expect(400)
        .then(({ body }) => expect(body.msg).toBe('invalid limit query'));
    });
    it('200: returns second n (=default limit) results for page query', () => {
      return request(app)
        .get('/api/reviews/2/comments?page=2')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toHaveLength(0);
        });
    });
    it('200: returns results based on set limit and page', () => {
      return request(app)
        .get('/api/reviews/2/comments?page=2&limit=1')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toHaveLength(1);
          expect(body.comments[0]).toEqual({
            comment_id: 4,
            author: 'bainesface',
            body: 'EPIC board game!',
            votes: 16,
            created_at: '2017-11-22T12:36:03.389Z',
          });
        });
    });
    it('400: returns error message if page query is invalid', () => {
      return request(app)
        .get('/api/reviews/2/comments?page=droptable')
        .expect(400)
        .then(({ body }) => expect(body.msg).toBe('invalid page query'));
    });
  });
});

describe('UTIL: checkExists', () => {
  it('400: not found', () => {
    const input = ['categories', 'slug', 'strategy'];

    return checkExists(...input).catch((err) =>
      expect(err.msg).toBe('not found')
    );
  });
  it('resource exists', () => {
    const input = ['categories', 'slug', 'euro game'];

    return checkExists(...input).then((res) => {
      expect(res).toBe(undefined);
    });
  });
});
