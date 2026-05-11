// backend/src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // ĐÃ SỬA: Bổ sung thêm quyền "host" để khớp với Frontend
    role: { type: String, enum: ["user", "admin", "host"], default: "user" },
    userType: { type: String, enum: ["tenant", "landlord"], default: "tenant" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);