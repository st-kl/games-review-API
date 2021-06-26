const {
  selectCategories,
  addCategory,
} = require('../models/categories.models');

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.postCategory = (req, res, next) => {
  const newCategory = req.body;
  addCategory(newCategory)
    .then((categories) => {
      res.status(201).send({ categories });
    })
    .catch(next);
};
