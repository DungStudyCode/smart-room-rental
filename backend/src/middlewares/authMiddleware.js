// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Lấy token từ header
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Từ chối truy cập. Không có token.' });
    }

    try {
        // Giải mã token (Nhớ đảm bảo process.env.JWT_SECRET giống với lúc Login)
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_cua_ban');
        req.user = verified; // Gắn thông tin user vào request để hostController dùng
        next(); // Cho phép đi tiếp
    } catch (err) {
        res.status(400).json({ success: false, message: 'Token không hợp lệ.' });
    }
};

module.exports = { verifyToken };