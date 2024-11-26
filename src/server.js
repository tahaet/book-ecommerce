const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const app = require("./app");

const DB =
  process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD || ""
  ) || "";

mongoose
  .connect(DB)
  .then()
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
