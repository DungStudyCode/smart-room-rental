// backend/src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Kết nối đến MongoDB bằng chuỗi URI trong file .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Kết nối MongoDB thành công: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Lỗi kết nối MongoDB: ${error.message}`);
    process.exit(1); // Dừng server nếu lỗi Database
  }
};

module.exports = connectDB;