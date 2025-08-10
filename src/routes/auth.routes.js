const router = require("express").Router();
const { register, login, updateProfile } = require("../controllers/auth.controller");

// Existing routes
router.post("/register", register);
router.post("/login", login);

// New route to update profile
router.put("/profile/:id", updateProfile);

module.exports = router;
