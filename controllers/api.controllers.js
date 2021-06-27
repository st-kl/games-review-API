apiInfo = {
  'GET /api': {
    description:
      'serves up a json representation of all the available endpoints of the api',
  },
  'GET /api/reviews': {
    description: 'serves an array of all reviews',
    queries: ['category', 'sort_by', 'order', 'title', 'page', 'limit'],
    exampleResponse: {
      reviews: [
        {
          owner: 'cooljmessy',
          title: 'Velit tempor ullamco amet ipsum dolor voluptate.',
          review_id: 14,
          category: 'hidden-roles',
          review_img_url:
            'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
          created_at: '2021-02-05T11:27:26.563Z',
          votes: 3,
          comment_count: 0,
        },
      ],
    },
  },
  'GET /api/reviews/:review_id': {
    description: 'serves an array with the specified review',
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
          comment_count: 3,
        },
      ],
    },
  },
  'GET /api/reviews/:review_id/comments': {
    description: 'serves an array with comments of the specified review',
    queries: ['page', 'limit'],
    exampleResponse: {
      comments: [
        {
          comment_id: 1,
          votes: 16,
          created_at: '2017-11-22T12:36:03.389Z',
          author: 'happyamy2016',
          body: 'I loved this game too!',
        },
      ],
    },
  },
  'GET /api/categories': {
    description: 'serves an array of all categories',
    exampleResponse: {
      categories: [
        {
          slug: 'Social deduction',
          description: "Players attempt to uncover each other's hidden role",
        },
      ],
    },
  },
  'GET /api/users': {
    description: 'serves an array of all users',
    exampleResponse: {
      users: [
        {
          username: 'cooljmessy',
          avatar_url: 'https://i.imgur.com/WfX0Neu.jpg',
          name: 'Peter Messy',
        },
      ],
    },
  },
  'GET /api/users/:username': {
    description: 'serves an array with the specified user',
    exampleResponse: {
      users: [
        {
          username: 'cooljmessy',
          avatar_url: 'https://i.imgur.com/WfX0Neu.jpg',
          name: 'Peter Messy',
        },
      ],
    },
  },
  'POST /api/reviews': {
    description: 'serves an array with the new review',
    body: {
      owner: 'bainesface',
      title: 'new game',
      review_body: 'review body',
      designer: 'Mario',
      category: 'strategy',
    },
    exampleResponse: {
      reviews: [
        {
          owner: 'tickle122',
          title: 'new game',
          review_body: 'review body',
          designer: 'Mario',
          category: 'strategy',
          review_id: 35,
          votes: 0,
          created_at: '2021-06-27T09:23:44.610Z',
        },
      ],
    },
  },
  'PATCH /api/reviews/:review_id': {
    description:
      'serves an array with the review updated by the specified number of votes',
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
  'DELETE /api/reviews/:review_id': {
    description: 'deletes specified review',
  },
  'POST /api/reviews/:review_id/comments': {
    description: 'serves an array with the new comment',
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
  'PATCH /api/comments/:comment_id': {
    description:
      'serves an array with the comment updated by the specified number of votes',
    body: { inc_votes: 13 },
    exampleResponse: {
      comments: [
        {
          comment_id: 2,
          author: 'tickle122',
          review_id: 4,
          votes: 42,
          created_at: '2021-01-18T10:09:05.410Z',
          body: 'My dog loved this game too!',
        },
      ],
    },
  },
  'DELETE /api/comments/:comment_id': {
    description: 'deletes specified comment',
  },
  'POST /api/categories': {
    description: 'serves an array with the new category',
    body: {
      slug: 'luck',
      description: 'Games without strategy',
    },
    exampleResponse: {
      categories: [
        {
          slug: 'luck',
          description: 'Games without strategy',
        },
      ],
    },
  },
};

getApiInfo = (req, res, next) => {
  res.status(200).send({ apiInfo });
};

module.exports = { apiInfo, getApiInfo };
