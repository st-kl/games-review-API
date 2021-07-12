const express = require('express');
const {
  handleInvalidPath,
  customErrors,
  handlePsqlErrors,
  handle500Errors,
} = require('./errors/app.errors');
const apiRouter = require('./routes/api.router');
const app = express();
const cors = require('/cors');

app.use(cors());
app.use(express.json());

// ------- Routers -------
app.use('/api', apiRouter);

// ------- Errors -------
app.all('/*', handleInvalidPath);
app.use(customErrors);
app.use(handlePsqlErrors);
app.use(handle500Errors);

module.exports = app;
