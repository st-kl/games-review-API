const express = require('express');

apiInfo = {
  'GET /api': {
    description:
      'serves up a json representation of all the available endpoints of the api',
  },
  'GET /api/categories': {
    description: 'serves an array of all categories',
    queries: [],
    exampleResponse: {
      categories: [
        {
          description: "Players attempt to uncover each other's hidden role",
          slug: 'Social deduction',
        },
      ],
    },
  },
  'GET /api/reviews': {
    description: 'serves an array of all reviews',
    queries: ['category', 'sort_by', 'order'],
    exampleResponse: {
      reviews: [
        {
          title: 'One Night Ultimate Werewolf',
          designer: 'Akihisa Okui',
          owner: 'happyamy2016',
          review_img_url:
            'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
          category: 'hidden-roles',
          created_at: '2017-11-22T12:43:33.389Z',
          votes: 5,
        },
      ],
    },
  },
  'GET /api/reviews/:review_id': {
    description: 'serves an array with the specified review',
    queries: [],
    exampleResponse: {
      reviews: [
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
      ],
    },
  },
  'PATCH /api/reviews/:review_id': {
    description:
      'serves an array with the review updated by the specified number of votes',
    queries: [],
    body: { inc_votes: 13 },
    exampleResponse: {
      reviews: [
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
          votes: 18,
        },
      ],
    },
  },
  'GET /api/reviews/:review_id/comments': {
    description: 'serves an array with comments for the specified review',
    queries: [],
    exampleResponse: {
      comments: [
        {
          comment_id: 1,
          votes: 16,
          created_at: '2017-11-22T12:43:33.389Z',
          author: 'bainesface',
          body: 'I loved this game too!',
        },
      ],
    },
  },
  'POST /api/reviews/:review_id/comments': {
    description: 'serves an array with the new comment',
    queries: [],
    body: { username: 'bainesface', body: 'new comment' },
    exampleResponse: {
      comments: [
        {
          comment_id: 7,
          author: 'bainesface',
          review_id: 1,
          votes: 0,
          created_at: '2017-11-22T12:43:33.389Z',
          body: 'new comment',
        },
      ],
    },
  },
  'DELETE /api/comments/:comment_id': {
    description: 'deletes specified comment',
    queries: [],
  },
};

getApiInfo = (req, res, next) => {
  res.status(200).send({ apiInfo });
};

module.exports = { apiInfo, getApiInfo };
