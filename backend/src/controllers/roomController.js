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

module.exports = { getPublicRooms };