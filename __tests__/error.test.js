const app = require('../app.js');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');

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

describe('GET /api/reviews/:review_id', () => {
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
        expect(body.msg).toBe('category does not exist');
      });
  });
});
