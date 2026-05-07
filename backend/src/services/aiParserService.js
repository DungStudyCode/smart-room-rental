const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
require('dotenv').config();

// Khởi tạo Gemini (Đảm bảo bạn đã bỏ GEMINI_API_KEY vào file .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseRoomData = async (rawText) => {
  try {
    // Sử dụng model mới nhất để bóc tách dữ liệu
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        // Ép kiểu trả về JSON chuẩn xác theo Schema
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            price: { type: SchemaType.NUMBER, description: "Giá phòng theo VNĐ. Nếu là '1 củ rưỡi' thì ghi 1500000" },
            area: { type: SchemaType.NUMBER, description: "Diện tích phòng tính bằng m2" },
            address: { type: SchemaType.STRING, description: "Địa chỉ cụ thể, bắt buộc có tên Đường, Phường, Quận tại Đà Nẵng" },
            phone: { type: SchemaType.STRING, description: "Số điện thoại liên hệ" },
            amenities: { 
              type: SchemaType.ARRAY, 
              items: { type: SchemaType.STRING },
              description: "Danh sách tiện ích: gác lửng, máy lạnh, nuôi pet..."
            },
            confidence_score: { type: SchemaType.NUMBER, description: "Độ tự tin của AI từ 0 đến 100" }
          },
          required: ["price", "address", "phone", "confidence_score"],
        },
      },
    });

    const prompt = `Bạn là một chuyên gia bất động sản tại Đà Nẵng. Hãy trích xuất thông tin phòng trọ từ bài viết Facebook lộn xộn sau đây:\n\n"${rawText}"`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    return JSON.parse(response);
  } catch (error) {
    console.error("Lỗi khi bóc tách AI:", error);
    return null;
  }
};

module.exports = { parseRoomData };