const express = require("express");
const { register, login } = require("../../controllers/Auth");

const router = express.Router();

router.post("/sign_up", register);
router.post("/sign_in", login);

module.exports = router;