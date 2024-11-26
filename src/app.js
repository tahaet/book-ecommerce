const express = require('express');
const AppError = require('./appError');
const globalErrorHandler = require('./controllers/errorController');
const categoryRouter = require('./routes/categoryRouter');

const app = express();

app.use(express.json());
app.use('/categories', categoryRouter);

app.all('*', (err, req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
