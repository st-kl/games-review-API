// extract any functions you are using to manipulate your data, into this file

exports.createCategoryData = (array) => {
  return array.map((category) => {
    return [category.slug, category.description];
  });
};
