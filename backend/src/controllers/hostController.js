// backend/src/controllers/hostController.js
const Room = require('../models/Room');
const mongoose = require('mongoose');

// 1. Hàm Đăng tin thủ công
const createManualRoom = async (req, res) => {
  try {
    // Lấy dữ liệu text từ form
    const { title, description, price, area, address, location, amenities, phone } = req.body;
    
    // Tạm thời để mảng rỗng nếu chưa có link ảnh (Chúng ta sẽ tích hợp Multer/Cloudinary sau)
    const imageUrls = req.body.imageUrls || []; 

    // Parse lại location và amenities (Vì formData gửi lên dạng chuỗi JSON)
    const parsedLocation = location ? JSON.parse(location) : { lat: 16.0544, lng: 108.2022 };
    const parsedAmenities = amenities ? JSON.parse(amenities) : [];

    // Tạo phòng mới
    const newRoom = new Room({
      title,
      description,
      price: Number(price),
      area: Number(area),
      address,
      location: parsedLocation,
      amenities: parsedAmenities,
      phone,
      images: imageUrls,
      source: 'MANUAL',
      status: 'PENDING', // Đăng xong phải chờ Admin duyệt
      authorId: req.user ? req.user._id : null // Lấy ID từ token đăng nhập
    });

    await newRoom.save();

    res.status(201).json({ 
      success: true, 
      message: 'Đăng tin thành công! Vui lòng chờ Admin kiểm duyệt.',
      data: newRoom 
    });

  } catch (error) {
    console.error("Lỗi đăng tin:", error);
    res.status(500).json({ success: false, error: 'Lỗi server khi đăng tin.' });
  }
};

// 2. Hàm lấy Thống kê cho Dashboard
const getDashboardStats = async (req, res) => {
  try {
    const hostId = req.user._id; // Lấy ID từ token

    const stats = await Room.aggregate([
      { 
        $match: { authorId: new mongoose.Types.ObjectId(hostId) } 
      },
      {
        $group: {
          _id: null,
          totalRooms: { $sum: 1 },
          totalViews: { $sum: { $ifNull: ["$views", 0] } }, 
          expectedRevenue: { $sum: "$price" },
          totalBookings: {
            $sum: { $cond: [{ $eq: ["$status", "RENTED"] }, 1, 0] }
          }
        }
      }
    ]);

    const defaultStats = {
      totalRooms: 0,
      totalViews: 0,
      expectedRevenue: 0,
      totalBookings: 0
    };

    const finalStats = stats.length > 0 ? stats[0] : defaultStats;

    res.status(200).json({
      success: true,
      data: finalStats
    });

  } catch (error) {
    console.error("Lỗi lấy thống kê Dashboard:", error);
    res.status(500).json({ success: false, error: 'Lỗi server khi lấy thống kê' });
  }
};

module.exports = { 
  createManualRoom,
  getDashboardStats
};