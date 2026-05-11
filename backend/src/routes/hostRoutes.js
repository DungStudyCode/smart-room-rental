// backend/src/routes/hostRoutes.js
const express = require('express');
const router = express.Router();
const hostController = require('../controllers/hostController');

// ĐÃ SỬA LẠI ĐƯỜNG DẪN: Đổi thành 'middlewares' và 'authMiddleware'
const { verifyToken } = require('../middlewares/authMiddleware'); 

// Khai báo các đường dẫn
router.post('/rooms', verifyToken, hostController.createManualRoom);
router.get('/dashboard-stats', verifyToken, hostController.getDashboardStats);

module.exports = router;