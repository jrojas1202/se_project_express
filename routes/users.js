const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { authorize } = require("../middleware/auth");

router.get("/me", authorize, getCurrentUser);

router.patch("/me", authorize, updateProfile);

module.exports = router;
