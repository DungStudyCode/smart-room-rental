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
  location: {
    lat: { type: Number, default: 16.0544 }, 
    lng: { type: Number, default: 108.2022 }
  },
  images: { 
    type: [String], 
    default: ["https://placehold.co/600x400?text=TroSmart+Room"] 
  },
  amenities: [String], 
  isVip: { 
    type: Boolean, 
    default: false 
  },
  status: { 
    type: String, 
    enum: ['AVAILABLE', 'RENTED', 'PENDING', 'HIDDEN'], 
    default: 'PENDING' 
  },
  phone: { 
    type: String, 
    required: [true, 'Số điện thoại liên hệ là bắt buộc'] 
  },
  postUrl: { 
    type: String,
    unique: true, 
    sparse: true  
  },
  // ĐÃ THÊM: Nguồn gốc tin (Cào từ Web hay Đăng thủ công)
  source: { 
    type: String,
    default: 'MANUAL'
  },
  // ĐÃ THÊM: Liên kết với ID của Chủ nhà (Để đếm cho Dashboard)
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // ĐÃ THÊM: Số lượt xem phòng
  views: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Room', roomSchema);