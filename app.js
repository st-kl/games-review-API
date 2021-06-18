const express = require('express');
const {
  handleInvalidPath,
  customErrors,
  handlePsqlErrors,
  handle500Errors,
} = require('./errors/app.errors');
const apiRouter = require('./routes/api.router');
const app = express();

app.use(express.json());

// ------- Routers -------
app.use('/api', apiRouter);

// ------- Errors -------
app.all('/*', handleInvalidPath);
app.use(customErrors);
app.use(handlePsqlErrors);
app.use(handle500Errors);

module.exports = app;
