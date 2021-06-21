const { getApiInfo } = require('../controllers/api.controllers');
const categoriesRouter = require('./categories.router');
const commentsRouter = require('./comments.router');
const reviewsRouter = require('./reviews.router');
const apiRouter = require('express').Router();

apiRouter.get('/', getApiInfo);

// categories router
apiRouter.use('/categories', categoriesRouter);

// reviews router
apiRouter.use('/reviews', reviewsRouter);
module.exports = apiRouter;

// comments router
apiRouter.use('/comments', commentsRouter);
