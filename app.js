const express = require('express');
const apiRouter = require('./routes/api.router');
const app = express();

app.use(express.json());

// Routers
app.use('/api', apiRouter);

// Errors
//app.use(...);

module.exports = app;
