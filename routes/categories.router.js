const {
  getCategories,
  postCategory,
} = require('../controllers/categories.controllers');
const categoriesRouter = require('express').Router();

categoriesRouter.get('/', getCategories);
categoriesRouter.post('/', postCategory);

module.exports = categoriesRouter;
