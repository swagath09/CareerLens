const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { aiController } = require("../controllers/aiController");

router.post("/chat", verifyToken, aiController);

module.exports = router;