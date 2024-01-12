const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { authorize } = require("../middleware/auth");
const { validateUpdateProfile } = require("../middleware/validation");

router.get("/me", authorize, getCurrentUser);

router.patch("/me", authorize, validateUpdateProfile, updateProfile);

module.exports = router;
