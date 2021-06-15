const categoriesRouter = require('./categories.router');
const apiRouter = require('express').Router();

//apiRouter.get("/", getApi);

apiRouter.use('/categories', categoriesRouter);
module.exports = apiRouter;
