const router = require("express").Router();

// const { authorize } = require("../middleware/auth"); // Commented out the authorize middleware

const { getUsers, getAUser, createUser } = require("../controllers/users");

// get all users
router.get("/", getUsers);

// get a specific user
router.get("/:userId", getAUser);

// create new user
router.post("/", createUser);

// Commented out the "/me" route for the next stage
// router.get("/me", authorize, getCurrentUser);

// Commented out the "/me" route for the next stage
// router.post("/me", authorize, updateProfile);

module.exports = router;
