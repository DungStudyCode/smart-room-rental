// backend/src/controllers/roomController.js
const Room = require('../models/Room');
const User = require('../models/User');

const getPublicRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: 'AVAILABLE' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getSavedRooms = async (req, res) => {
  try {
    // Sử dụng populate để lấy đầy đủ thông tin phòng thay vì chỉ lấy ID
    const user = await User.findById(req.user.id).populate({
        path: 'savedRooms',
        // match giúp lọc ra những phòng vẫn còn hiệu lực
        match: { status: 'AVAILABLE' } 
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // Trả về mảng đã được populate thông tin chi tiết
    res.status(200).json({ success: true, data: user.savedRooms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const toggleSaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // QUAN TRỌNG: Kiểm tra xem roomId đã tồn tại trong mảng chưa
    // Nên dùng .toString() hoặc .equals() vì ID trong MongoDB là dạng Object
    const isSaved = user.savedRooms.some(id => id.toString() === roomId);

    if (isSaved) {
      // Bỏ lưu
      user.savedRooms = user.savedRooms.filter(id => id.toString() !== roomId);
    } else {
      // Thêm vào đầu mảng để phòng mới lưu hiện lên trước
      user.savedRooms.unshift(roomId);
    }

    await user.save();
    
    res.status(200).json({ 
        success: true, 
        message: isSaved ? "Đã xóa khỏi danh sách lưu" : "Đã lưu phòng thành công",
        isSaved: !isSaved 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { 
    getPublicRooms, 
    getSavedRooms, 
    toggleSaveRoom 
};