const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");
// const { createUser, login } = require("../controllers/users");
const { NOT_FOUND } = require("../utils/errors");
// const { authorize } = require("../middleware/auth");

router.use("/items", clothingItems);
router.use("/users", users);

// Commented out the "/signup" route for the next stage
// router.post("/signup", createUser);

// Commented out the "/signin" route for the next stage
// router.post("/signin", login);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
