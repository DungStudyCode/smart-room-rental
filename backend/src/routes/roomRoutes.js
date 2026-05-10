// backend/src/routes/roomRoutes.js
const express = require('express');
const { getPublicRooms ,getSavedRooms, toggleSaveRoom } = require('../controllers/roomController');
//middleware
const { protect } = require ('../middleware/authMiddleware');

const router = express.Router();

// API: GET /api/rooms
router.get('/', getPublicRooms);
router.get('/saved', protect, getSavedRooms); 
router.post('/save/:roomId', protect, toggleSaveRoom); 


module.exports = router;