const { selectUsers, selectUserByName } = require('../models/users.models');

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByName = (req, res, next) => {
  const { username } = req.params;
  selectUserByName(username)
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
