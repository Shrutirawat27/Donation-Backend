const router = require("express").Router();
const { register, login, updateProfile } = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.put("/profile/:id", updateProfile);

module.exports = router;