// backend/src/controllers/roomController.js
const Room = require('../models/Room');

const getPublicRooms = async (req, res) => {
  try {
    // Chỉ lấy những phòng đã được Admin duyệt (AVAILABLE)
    // Sắp xếp mới nhất lên đầu
    const rooms = await Room.find({ status: 'AVAILABLE' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// THÊM HÀM NÀY: Lấy chi tiết 1 phòng theo ID
// ==========================================
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phòng trọ này.' });
    }
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Đừng quên export CẢ 2 hàm ra nhé
module.exports = { getPublicRooms, getRoomById };