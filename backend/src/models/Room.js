// backend/src/models/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Tiêu đề là bắt buộc'],
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, 'Mô tả là bắt buộc'] 
  },
  price: { 
    type: Number, 
    required: [true, 'Giá phòng là bắt buộc'] 
  },
  area: { 
    type: Number, 
    required: [true, 'Diện tích là bắt buộc'] 
  },
  address: { 
    type: String, 
    required: [true, 'Địa chỉ là bắt buộc'] 
  },
  // Để hỗ trợ PB05 (Bản đồ), chúng ta lưu tọa độ
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  images: { 
    type: [String], 
    default: ["https://placehold.co/600x400?text=TroSmart+Room"] 
  },
  amenities: [String], // Ví dụ: ['Máy lạnh', 'Wifi', 'Gác lửng']
  isVip: { 
    type: Boolean, 
    default: false 
  },
  status: { 
    type: String, 
    enum: ['AVAILABLE', 'RENTED', 'PENDING', 'HIDDEN'], 
    default: 'PENDING' // Mặc định chờ duyệt để AI parser hoạt động (PB12)
  },
  phone: { 
    type: String, 
    required: [true, 'Số điện thoại liên hệ là bắt buộc'] 
  }
}, { 
  timestamps: true // Tự động tạo createdAt và updatedAt (PB15)
});

module.exports = mongoose.model('Room', roomSchema);