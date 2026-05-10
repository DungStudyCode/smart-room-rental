const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    userType: { type: String, enum: ["tenant", "landlord"], default: "tenant" }, // Phân loại theo ảnh (Sinh viên/Chủ nhà)
    savedRooms: [ 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
