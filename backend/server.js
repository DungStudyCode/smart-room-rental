// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Import hàm kết nối Database
const connectDB = require('./src/config/db');

// 2. Import các Routes
const chatbotRoutes = require('./src/routes/chatbotRoutes');
const roomRoutes = require('./src/routes/roomRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

// 3. Khởi chạy kết nối đến MongoDB Atlas
connectDB();

// 4. Middlewares bắt buộc
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Giúp Backend đọc được req.body dưới dạng JSON

// 5. Gắn API Endpoints vào hệ thống
app.use('/api/chat', chatbotRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/admin', adminRoutes);

// Route test server
app.get('/', (req, res) => {
  res.send('Backend Hệ thống Tìm Trọ Đà Nẵng đang chạy cực mượt!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});