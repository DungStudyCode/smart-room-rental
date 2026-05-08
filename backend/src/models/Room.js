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
    lat: { type: Number },
    lng: { type: Number }
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

  // ==========================================
  // THÊM CÁC TRƯỜNG PHỤC VỤ CRAWLER (PB12)
  // ==========================================
  postUrl: { 
    type: String,
    unique: true, // Thêm unique để DB tự chặn nếu cào trùng bài
    sparse: true  // Cho phép null nếu đăng tin thủ công
  },
  source: { 
    type: String 
  }
  // ==========================================

}, { 
  timestamps: true 
});

// XÓA BỎ DÒNG: roomSchema.index({ postUrl: 1 }); <-- Xóa dòng này đi!

module.exports = mongoose.model('Room', roomSchema);