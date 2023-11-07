const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");
const { createUser, login } = require("../controllers/users");
const { NOT_FOUND } = require("../utils/errors");

router.use("/items", clothingItems);

router.use("/users", users);

router.post("/signup", createUser);

router.post("/signin", login);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
