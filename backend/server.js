// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cron = require('node-cron'); // Thư viện lên lịch tự động

// 1. Import hàm kết nối Database
const connectDB = require('./src/config/db');

// 2. Import các Routes và Controller
const chatbotRoutes = require('./src/routes/chatbotRoutes');
const roomRoutes = require('./src/routes/roomRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const authRoutes = require('./src/routes/authRoutes');

const { autoRunCrawler } = require('./src/controllers/adminController'); // Import hàm cào tự động


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
app.use('/api/auth', authRoutes);

// ==========================================
// 6. CÀI ĐẶT CRON JOB (AUTO-PILOT 30 PHÚT)
// ==========================================
// Cú pháp '*/30 * * * *' nghĩa là chạy mỗi 30 phút một lần
cron.schedule('*/30 * * * *', async () => {
  console.log('\n⏰ [Cron Job] Đã đến giờ đi săn! Khởi động Hệ thống Cào tự động...');
  // Truyền null cho req và res vì hàm này đang tự chạy ngầm, không qua HTTP Request
  await autoRunCrawler(null, null); 
});
console.log('✅ Chế độ Auto-Pilot (30 phút/lần) đã được kích hoạt ngầm!');

// Route test server
app.get('/', (req, res) => {
  res.send('Backend Hệ thống Tìm Trọ Đà Nẵng đang chạy cực mượt!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});