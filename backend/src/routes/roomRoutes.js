const express = require('express');
// Import các hàm xử lý từ Controller (Đảm bảo bạn đã tạo file roomController.js ở bước trước)
const { getRooms, getRoomById } = require('../controllers/roomController');

const router = express.Router();

// Định nghĩa các đường dẫn (Endpoints)
router.get('/', getRooms);       // Lấy danh sách tất cả phòng
router.get('/:id', getRoomById); // Lấy chi tiết 1 phòng theo ID

module.exports = router;