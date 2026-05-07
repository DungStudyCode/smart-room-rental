const express = require('express');
const { handleChat } = require('../controllers/chatbotController');

const router = express.Router();

// Định nghĩa API: POST /api/chat
router.post('/', handleChat);

module.exports = router;