//backend/src/controllers/roomController.js
const Room = require('../models/Room');

// Lấy danh sách phòng (PB03)
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: 'AVAILABLE' }).sort({ isVip: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: rooms.length, data: rooms });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Lấy chi tiết 1 phòng (PB04)
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ success: false, error: 'Không tìm thấy phòng' });
    res.status(200).json({ success: true, data: room });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};