const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  () => {
    console.log("DB is connected");
  },
  (e) => console.log("DB ERROR", e),
);

const routes = require("./routes");

app.use(express.json());

app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: "6522e28868c73a44d78433d8", // paste the _id of the test user created in the previous step
  };
  next();
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
