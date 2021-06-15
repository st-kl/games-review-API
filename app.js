const express = require('express');
const apiRouter = require('./routes/api.router');
const app = express();

app.use(express.json());

// Routers
app.use('/api', apiRouter);

// Errors
app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Not Found' });
});

// Handle status:500s
//app.use(handleError500s);

//app.use(...);

module.exports = app;
