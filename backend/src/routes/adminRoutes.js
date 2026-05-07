// backend/src/routes/adminRoutes.js
const express = require('express');
const { runCrawlerBot, getPendingRooms, approveRoom } = require('../controllers/adminController');

const router = express.Router();

router.post('/run-crawler', runCrawlerBot);
router.get('/pending-rooms', getPendingRooms);
router.put('/approve-room/:id', approveRoom);

module.exports = router;