const { getChatbotResponse } = require('../services/chatbotService');

const handleChat = async (req, res) => {
  try {
    // Lấy tin nhắn và lịch sử từ Frontend gửi lên
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Tin nhắn không được để trống" });
    }

    // Gọi Service AI xử lý
    const reply = await getChatbotResponse(message, history);

    // Trả kết quả về cho Frontend
    res.status(200).json({ 
      success: true, 
      reply: reply 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

module.exports = { handleChat };