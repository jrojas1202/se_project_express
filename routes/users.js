const router = require("express").Router();
// const { getCurrentUser, updateProfile } = require("../controllers/users");

// const { authorize } = require("../middleware/auth"); // Commented out the authorize middleware

// GET /users to return all users
router.get("/users", () => {});

// GET /users/:userId to return a user by _id
router.get("/users/:userId", () => {});

// POST /users to create a new user
router.post("/users", () => {});

// Commented out the "/me" route for the next stage
// router.get("/me", authorize, getCurrentUser);

// Commented out the "/me" route for the next stage
// router.post("/me", authorize, updateProfile);

module.exports = router;
