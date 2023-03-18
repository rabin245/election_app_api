const router = require("express").Router();
const { register, login, logout, verify } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verify);
router.post("/logout", logout);

module.exports = router;
