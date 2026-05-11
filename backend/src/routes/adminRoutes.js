// backend/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();

// 1. Import Middleware xác thực (Nhớ kiểm tra đúng tên thư mục middlewares hay middleware nhé)
const { verifyToken } = require('../middlewares/authMiddleware.js');

// 2. Import TẤT CẢ các hàm từ Controller (Đã bổ sung getAdminDashboardStats)
const { 
  runCrawlerBot, 
  getPendingRooms, 
  approveRoom,
  toggleAutoBot,
  getBotStatus,
  deleteRoom,
  getAllUsers,
  getAllRooms,
  updateRoomStatus,
  getAdminDashboardStats // BỔ SUNG HÀM NÀY
} = require('../controllers/adminController');


// ==========================================
// 🌟 API THỐNG KÊ CHO DASHBOARD
// ==========================================
router.get('/dashboard-stats', verifyToken, getAdminDashboardStats);

// ==========================================
// Các API quản lý tin đăng & cào thủ công
// ==========================================
router.post('/run-crawler', runCrawlerBot);
router.get('/pending-rooms', getPendingRooms);
router.put('/approve-room/:id', approveRoom);
router.delete('/reject-room/:id', deleteRoom);

// ==========================================
// Các API điều khiển Bot Auto-Pilot ngầm
// ==========================================
router.get('/bot/status', getBotStatus);     
router.post('/bot/toggle', toggleAutoBot);   

// ==========================================
// API quản lý Users và Rooms
// ==========================================
router.get('/users', getAllUsers);
router.get('/rooms', getAllRooms);
router.put('/rooms/:id', updateRoomStatus);

module.exports = router;