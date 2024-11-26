const express = require("express");

const app = express();

app.use(express.json());
app.use("/", (req, res, next) => {
  res.status(200).send("HELLO WORLD!!");
});
module.exports = app;
