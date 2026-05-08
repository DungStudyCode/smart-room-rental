// backend/src/services/aiParserService.js
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
require('dotenv').config();

// Khởi tạo Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Hàm Helper: Tạo độ trễ ngưng đọng hệ thống
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Thêm tham số retries = 3 (Thử lại tối đa 3 lần nếu bị Google chặn)
const parseRoomData = async (rawText, retries = 3) => {
  // Khởi tạo model bên ngoài vòng lặp để tối ưu hiệu suất
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
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

// --- THAY THẾ ĐOẠN PROMPT CŨ BẰNG ĐOẠN NÀY ---
  const prompt = `
    Bạn là một hệ thống AI chuyên bóc tách dữ liệu bất động sản (phòng trọ) tại Đà Nẵng.
    Nhiệm vụ của bạn là phân tích bài đăng Facebook lộn xộn dưới đây và trả về JSON chuẩn.

    NỘI DUNG BÀI ĐĂNG:
    "${rawText}"

    QUY TẮC CHẤM ĐIỂM (confidence_score từ 0 đến 100):
    1. ĐIỂM 0 - 30 (BỎ QUA NGAY): 
       - Bài này là bài "TÌM PHÒNG" (người thuê đăng hỏi tìm phòng).
       - Bài quảng cáo rác (bán quần áo, sim thẻ, cho vay...).
       - Bài không liên quan đến cho thuê chỗ ở.
    2. ĐIỂM 40 - 60 (TẠM ĐƯỢC): 
       - Bài CÓ CHO THUÊ phòng, nhưng thông tin quá sơ sài (không có giá rõ ràng, địa chỉ chung chung).
    3. ĐIỂM 70 - 100 (BÀI CHUẨN): 
       - Bài CHO THUÊ phòng rõ ràng.
       - Liệt kê giá thuê và khu vực/địa chỉ tương đối dễ hiểu.

    LƯU Ý KHI TRÍCH XUẤT:
    - Nếu giá là "1 củ rưỡi" -> price = 1500000. Nếu "thỏa thuận" -> price = 0.
    - Nếu không thấy diện tích m2 -> area = 20 (mặc định).
    - Cố gắng tìm mọi số điện thoại có trong bài để điền vào phone.
  `;
  // VÒNG LẶP TỰ ĐỘNG PHỤC HỒI (SMART RETRY)
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // DỌN DẸP MARKDOWN: Loại bỏ chuỗi ```json và ``` để ép về text thuần
      const cleanedResponse = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      return JSON.parse(cleanedResponse);
      
    } catch (error) {
      // 1. Kiểm tra nếu là lỗi 429 Quota Exceeded
      if (error.status === 429 || (error.message && error.message.includes('429'))) {
        console.log(`\n⚠️ [Google AI] Hệ thống API đang quá tải. Kích hoạt ngủ đông 45 giây để phục hồi... (Lần thử ${i + 1}/${retries})`);
        
        // Ép Node.js dừng 45 giây để án phạt của Google hết hạn
        await delay(45000); 
      } 
      // 2. Nếu là lỗi khác (Lỗi mạng, sai định dạng JSON) thì log ra và kết thúc
      else {
        console.error("❌ Lỗi hệ thống AI Parser:", error.message);
        return null;
      }
    }
  }

  // Nếu đã thử đủ 3 lần, ngủ đủ 45 giây mỗi lần mà vẫn thất bại
  console.log("❌ Đã thử lại 3 lần nhưng API Google vẫn từ chối. Bỏ qua tin này.");
  return null;
};

module.exports = { parseRoomData };