const categoriesRouter = require('./categories.router');
const reviewsRouter = require('./reviews.router');
const apiRouter = require('express').Router();

//apiRouter.get("/", getApi);

// categories router
apiRouter.use('/categories', categoriesRouter);

// reviews router
apiRouter.use('/reviews', reviewsRouter);
module.exports = apiRouter;
