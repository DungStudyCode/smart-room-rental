// backend/src/routes/roomRoutes.js
const express = require('express');
const { getPublicRooms } = require('../controllers/roomController');

const router = express.Router();

// API: GET /api/rooms
router.get('/', getPublicRooms);

module.exports = router;