const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getChatbotResponse = async (userMessage, chatHistory = []) => {
  try {
    // Sử dụng model flash để phản hồi nhanh nhất có thể trong chat real-time
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: `Bạn là trợ lý AI tìm trọ tên là TroSmart AI, chuyên hỗ trợ sinh viên và người lao động tìm phòng trọ tại Đà Nẵng.
      Quy tắc của bạn:
      1. Luôn trả lời ngắn gọn, thân thiện, xưng "mình" và gọi "bạn".
      2. Nếu người dùng muốn tìm phòng, hãy khéo léo hỏi đủ 3 thông tin: Khu vực (Quận/Đường), Mức giá tối đa, và Tiện ích cần thiết (VD: gác lửng, ban công).
      3. Tuyệt đối không trả lời các câu hỏi ngoài lề không liên quan đến bất động sản, thuê nhà, hoặc cuộc sống tại Đà Nẵng.`
    });

    // Khởi tạo phiên chat với lịch sử cuộc hội thoại (để AI nhớ câu trước đó)
    const chat = model.startChat({
      history: chatHistory,
    });

    // Gửi tin nhắn mới của user và đợi AI trả lời
    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();

    return response;
  } catch (error) {
    console.error("Lỗi gọi Gemini API:", error);
    throw new Error("Hệ thống AI đang bận, vui lòng thử lại sau.");
  }
};

module.exports = { getChatbotResponse };