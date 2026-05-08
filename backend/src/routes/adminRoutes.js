// backend/src/routes/adminRoutes.js
const express = require('express');
const { 
  runCrawlerBot, 
  getPendingRooms, 
  approveRoom,
  toggleAutoBot,   // Bổ sung hàm bật/tắt
  getBotStatus,    // Bổ sung hàm kiểm tra trạng thái
  deleteRoom       // THÊM IMPORT HÀM XÓA TIN
} = require('../controllers/adminController');

const router = express.Router();

// 1. Các API quản lý tin đăng & cào thủ công
router.post('/run-crawler', runCrawlerBot);
router.get('/pending-rooms', getPendingRooms);
router.put('/approve-room/:id', approveRoom);
router.delete('/reject-room/:id', deleteRoom); // THÊM DÒNG NÀY ĐỂ NỐI VỚI NÚT XÓA Ở FRONTEND

// 2. Các API điều khiển Bot Auto-Pilot ngầm
router.get('/bot/status', getBotStatus);     // GET: Trả về { isRunning: true/false }
router.post('/bot/toggle', toggleAutoBot);   // POST: Gửi { action: 'start' } hoặc { action: 'stop' }

module.exports = router;