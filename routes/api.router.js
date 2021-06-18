const { getApiInfo } = require('../controllers/api.controllers');
const categoriesRouter = require('./categories.router');
const reviewsRouter = require('./reviews.router');
const apiRouter = require('express').Router();
getApiInfo;

apiRouter.get('/', getApiInfo);

// categories router
apiRouter.use('/categories', categoriesRouter);

// reviews router
apiRouter.use('/reviews', reviewsRouter);
module.exports = apiRouter;
