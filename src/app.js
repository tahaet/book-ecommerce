const express = require('express');
const AppError = require('./appError');
const errorController = require('./controllers/errorController');

const app = express();

app.use(express.json());
app.use('/', (req, res, next) => {
  res.status(200).send('HELLO WORLD!!');
});

app.all('*', (err, req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorController.globalErrorHandler);

module.exports = app;
