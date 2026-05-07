// backend/src/controllers/adminController.js
const { scrapeDataFromUrl } = require('../services/crawlerService');
const { parseRoomData } = require('../services/aiParserService');
const Room = require('../models/Room');

// 1. [POST] /api/admin/run-crawler - Kích hoạt Bot cào dữ liệu
const runCrawlerBot = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, error: 'Vui lòng cung cấp URL để cào dữ liệu.' });
  }

  try {
    const rawText = await scrapeDataFromUrl(url);
    if (!rawText) throw new Error('Không thể lấy dữ liệu từ URL này.');

    console.log('[AI Parser] Đang gửi dữ liệu cho Gemini xử lý...');
    const parsedData = await parseRoomData(rawText);
    
    if (!parsedData || parsedData.confidence_score < 50) {
      return res.status(400).json({ 
        success: false, 
        message: 'AI không thể nhận diện đủ thông tin phòng trọ từ bài viết này.',
        rawText: rawText.substring(0, 200) + '...'
      });
    }

    const newRoom = new Room({
      title: `Phòng trọ tại ${parsedData.address.split(',')[0]}`,
      description: `Chi tiết cào được:\n${rawText.substring(0, 300)}...`,
      price: parsedData.price,
      area: parsedData.area || 20,
      address: parsedData.address,
      amenities: parsedData.amenities || [],
      phone: parsedData.phone || "Chưa xác định",
      status: 'PENDING',
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"]
    });

    await newRoom.save();

    res.status(200).json({ 
      success: true, 
      message: 'Crawler và AI đã xử lý thành công!',
      data: newRoom 
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. [GET] /api/admin/pending-rooms - Lấy danh sách tin đang chờ duyệt
const getPendingRooms = async (req, res) => {
  try {
    // Chỉ lấy những phòng có status là PENDING, sắp xếp mới nhất lên đầu
    const rooms = await Room.find({ status: 'PENDING' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. [PUT] /api/admin/approve-room/:id - Phê duyệt tin đăng
const approveRoom = async (req, res) => {
  try {
    // Tìm phòng theo ID và update status thành AVAILABLE
    const room = await Room.findByIdAndUpdate(
      req.params.id, 
      { status: 'AVAILABLE' }, 
      { new: true } // Trả về data mới sau khi update
    );
    
    if (!room) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy tin đăng này.' });
    }
    
    res.status(200).json({ success: true, message: 'Đã duyệt tin thành công', data: room });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Đừng quên export cả 3 hàm ra nhé
module.exports = { runCrawlerBot, getPendingRooms, approveRoom };