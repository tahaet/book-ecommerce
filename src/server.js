const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log(err);
  process.exit(1);
});
const DB =
  process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD || '',
  ) || '';

mongoose
  .connect(DB)
  .then()
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
