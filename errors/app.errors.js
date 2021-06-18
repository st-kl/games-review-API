// undefined path
exports.handleInvalidPath = (req, res) => {
  res.status(404).send({ msg: 'Not Found' });
};

// custom errors
exports.customErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

// psql errors
exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad Request' });
  } else if (err.code === '23503') {
    res.status(404).send({ msg: 'Not Found' });
  } else {
    next(err);
  }
};

// server/remaining errors
exports.handle500Errors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal Server Error' });
};
