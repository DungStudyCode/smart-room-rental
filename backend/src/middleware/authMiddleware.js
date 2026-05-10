// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];


      // Sử dụng đúng secret key từ .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Log để kiểm tra nếu cần: console.log("Decoded Token:", decoded);

      // Tìm user. Lưu ý: decoded.id hay decoded._id tùy vào lúc bạn sign token
      req.user = await User.findById(decoded.id || decoded._id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Người dùng không tồn tại!' });
      }

      next();
    } catch (error) {
      console.error("Lỗi xác thực Token:", error.message);
      
      // Phân loại lỗi để phản hồi chính xác hơn
      let msg = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!';
      if (error.name === 'JsonWebTokenError') msg = 'Token không hợp lệ!';
      
      return res.status(401).json({ success: false, message: msg });
    }
  } else {
      return res.status(401).json({ success: false, message: 'Bạn chưa đăng nhập!' });
  }
};

module.exports = { protect };