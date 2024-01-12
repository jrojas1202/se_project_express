const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");
const { createUser, login } = require("../controllers/users");
const NotFoundError = require("../errors/not-found-err");
const {
  validateLoginBody,
  validateUserInfoBody,
} = require("../middleware/validation");

router.use("/items", clothingItems);

router.use("/users", users);

router.post("/signup", validateUserInfoBody, createUser);

router.post("/signin", validateLoginBody, login);

router.use((req, res, next) => {
  next(new NotFoundError("Router not Found"));
});

module.exports = router;
