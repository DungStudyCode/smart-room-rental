// backend/src/routes/roomRoutes.js
const express = require('express');
const { getPublicRooms, getRoomById } = require('../controllers/roomController'); 

const router = express.Router();

router.get('/', getPublicRooms);
router.get('/:id', getRoomById); // Dòng này sẽ bắt cái ID trên URL

module.exports = router;