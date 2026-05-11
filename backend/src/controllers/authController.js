const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Đăng ký tài khoản người dùng
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, userType } = req.body;
    // Kiểm tra email tồn tại
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email này đã được sử dụng" });

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      userType, // 'tenant' hoặc 'landlord'
    });
    await newUser.save();
    res.status(201).json({ message: "Đăng ký tài khoản thành công!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 1. Đăng nhập (Bổ sung trả về savedRooms)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role,
        userType: user.userType,
        avatar: user.avatar, // Thêm avatar
        savedRooms: user.savedRooms || [], // Quan trọng: Tránh lỗi map ở frontend
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// 2. Cập nhật thông tin profile 
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ success: false, message: "User không tồn tại" });

    // Cập nhật thông tin cơ bản
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;

    // Xử lý đổi mật khẩu
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Vui lòng nhập mật khẩu hiện tại" });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu hiện tại không chính xác" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({ success: true, message: "Cập nhật thành công", data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
