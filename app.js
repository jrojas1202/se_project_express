const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");

const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB is connected");
  })
  .catch((e) => console.error("DB ERROR", e));

const routes = require("./routes");

app.use(express.json());

app.use(helmet());

app.use(cors());

app.use(routes);

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
