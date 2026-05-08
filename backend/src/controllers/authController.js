const User = require('../models/User');
const bcrypt = require('bcryptjs'); // thư viện mã hóa mật khẩu
const jwt = require('jsonwebtoken');

// Đăng ký tài khoản người dùng
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, userType } = req.body;
    
    // Kiểm tra email tồn tại
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email này đã được sử dụng' });

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      userType // 'tenant' hoặc 'landlord'
    });

    await newUser.save();
    res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Đăng nhập (Dùng chung cho cả Admin và User)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Tạo JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role,
        userType: user.userType
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};