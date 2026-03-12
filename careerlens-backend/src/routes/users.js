const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getMe, getProfile } = require('../controllers/userController');

router.get('/me', verifyToken, getMe);
router.get('/profile', verifyToken, getProfile);

module.exports = router;
