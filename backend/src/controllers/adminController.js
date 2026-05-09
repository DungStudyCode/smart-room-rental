// backend/src/controllers/adminController.js
const cron = require("node-cron");
const Room = require("../models/Room");
const User = require("../models/User");
const { parseRoomData } = require("../services/aiParserService");

// --- IMPORT KIẾN TRÚC MODULAR MỚI ---
const { initBrowser } = require("../services/crawler/browser");
const { scrapeFacebookGroup } = require("../services/crawler/scraper");
const { sleep } = require("../services/crawler/utils");

let autoBotTask = null;
let isBotRunning = false;

const HUNTING_GROUNDS = [
  "https://www.facebook.com/groups/phongtrodanang",
  "https://www.facebook.com/groups/3230285527248786",
];

const extractVNPhone = (text) => {
  const matches = text.match(/(0[0-9\s\.\-]{9,13})/g);
  if (matches) {
    for (let match of matches) {
      const cleanPhone = match.replace(/\D/g, "");
      if (cleanPhone.length === 10 && cleanPhone.startsWith("0"))
        return cleanPhone;
    }
  }
  return null;
};

// --- HÀM LÕI: QUY TRÌNH CÀO & PHÂN TÍCH ---
async function processScraping(url, isAuto = false) {
  const { browser, page } = await initBrowser();
  const savedRooms = [];

  try {
    const scrapedPosts = await scrapeFacebookGroup(page, url);
    const maxPosts = scrapedPosts.length; // Duyệt toàn bộ số bài cào được

    for (let i = 0; i < maxPosts; i++) {
      // Mở rộng kho: Auto lấy 5 bài/lần, Thủ công lấy 10 bài/lần
      if (isAuto && savedRooms.length >= 5) break;
      if (!isAuto && savedRooms.length >= 10) break;

      const post = scrapedPosts[i];
      console.log(`\n--- ĐANG XỬ LÝ BÀI THỨ ${i + 1}/${maxPosts} ---`);

      // 1. GÁC CỔNG THÔ (NỚI LỎNG HOÀN TOÀN)
      // Chỉ cần bài viết CÓ HÌNH ẢNH hoặc CÓ SỐ ĐIỆN THOẠI là lụm ngay!
      let finalPhone = extractVNPhone(post.text);
      const hasImages = post.images && post.images.length > 0;
      const hasPhone = finalPhone && finalPhone.length === 10;

      if (!hasImages && !hasPhone) {
        console.log("⚠️ BỎ QUA: Bài viết trắng trơn (Không ảnh, Không SĐT).");
        continue; // Đỡ tốn công gọi AI
      }

      // 2. GỌI AI PHÂN TÍCH ĐỂ LẤY THÔNG TIN CHUẨN FORM
      console.log("⏳ Đang gửi AI phân tích (thỏa mãn điều kiện thu thập)...");
      const parsedData = await parseRoomData(post.text);
      await sleep(8000); // Nhường đường cho API Google thở

      // 3. XỬ LÝ DỮ LIỆU ĐỂ LƯU
      // Xóa hoàn toàn việc kiểm tra parsedData.confidence_score!

      // Chắt lọc lại SĐT từ AI nếu Regex phía trên bị sót
      if (!hasPhone && parsedData?.phone) {
        const aiPhone = String(parsedData.phone).replace(/\D/g, "");
        if (aiPhone.length === 10) finalPhone = aiPhone;
      }

      // Chống lỗi undefined nếu AI bóc tách thất bại, tự động gán dữ liệu mặc định
      finalPhone =
        finalPhone && finalPhone.length === 10 ? finalPhone : "Inbox Facebook";
      const price = parsedData?.price || 0;
      const area = parsedData?.area || 20;
      const address = parsedData?.address || "Đang cập nhật địa chỉ";
      const title = parsedData?.title || `Phòng trọ thu thập tự động`;
      const amenities = parsedData?.amenities || [];

      // Bộ lọc chống trùng bài
      const filter = post.postUrl
        ? { postUrl: post.postUrl }
        : { description: post.text.substring(0, 50) };

      const newRoomData = {
        title: title,
        description: `Tin thu thập tự động:\n${post.text.substring(0, 300)}...`,
        price: price,
        area: area,
        address: address,
        amenities: amenities,
        phone: finalPhone,
        images: post.images,
        source: url,
        postUrl: post.postUrl || url,
        status: "PENDING",
      };

      const savedDoc = await Room.findOneAndUpdate(filter, newRoomData, {
        upsert: true,
        new: true,
      });
      savedRooms.push(savedDoc);
      console.log(
        `✅ LƯU DB THÀNH CÔNG: SĐT: ${finalPhone} | ${post.images.length} Ảnh`
      );
    }
  } catch (error) {
    console.error(`❌ Lỗi quá trình Scraping:`, error.message);
  } finally {
    await browser.close();
  }

  return savedRooms;
}

// ==========================================
// API ENDPOINTS CỦA BẠN (GIỮ NGUYÊN)
// ==========================================
const runCrawlerBot = async (req, res) => {
  if (!req.body.url)
    return res.status(400).json({ success: false, error: "Thiếu URL." });
  try {
    const savedRooms = await processScraping(req.body.url, false);
    if (savedRooms.length === 0)
      return res.status(400).json({
        success: false,
        message: "Cào thất bại hoặc bị lọc hết (Thiếu SĐT/Trùng lặp).",
      });
    res.status(200).json({
      success: true,
      message: `Thành công! Đã chắt lọc được ${savedRooms.length} tin.`,
      data: savedRooms[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const autoRunCrawler = async (req, res) => {
  console.log(`\n🚀 [Auto-Pilot] Khởi động chu kỳ quét tự động...`);
  let totalSaved = 0;
  for (const url of HUNTING_GROUNDS) {
    if (totalSaved >= 5) break; // Giới hạn bot ngầm cào tối đa 5 bài/chu kỳ
    const rooms = await processScraping(url, true);
    totalSaved += rooms.length;
  }
  console.log(
    `\n🏁 [Auto-Pilot] Chu kỳ hoàn tất. Thu được ${totalSaved} tin mới.`
  );
};

const getPendingRooms = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: await Room.find({ status: "PENDING" }).sort({ createdAt: -1 }),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách người dùng", error });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const { status } = req.query; // Lấy status từ query string (?status=PENDING)
    const filter = status ? { status } : {}; // Nếu không có status thì lấy hết

    const rooms = await Room.find(filter).sort({ createdAt: -1 });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách bài đăng", error });
  }
};


const updateRoomStatus = async (req, res) => {
  try {
      const { id } = req.params;
      const { status } = req.body;
      
      const updatedRoom = await Room.findByIdAndUpdate(
          id, 
          { status }, 
          { new: true }
      );
      res.status(200).json(updatedRoom);
  } catch (error) {
      res.status(500).json({ message: "Lỗi cập nhật trạng thái", error });
  }
};

const approveRoom = async (req, res) => {
  try {
    const updatedData = { ...req.body, status: "AVAILABLE" };
    const room = await Room.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    if (!room)
      return res
        .status(404)
        .json({ success: false, error: "Không tìm thấy tin." });
    res
      .status(200)
      .json({ success: true, message: "Duyệt thành công", data: room });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room)
      return res
        .status(404)
        .json({ success: false, error: "Không tìm thấy tin để xóa." });
    res
      .status(200)
      .json({ success: true, message: "Đã xóa tin rác thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const toggleAutoBot = (req, res) => {
  const { action } = req.body;
  if (action === "start") {
    if (isBotRunning)
      return res
        .status(400)
        .json({ success: false, message: "Bot đang chạy!" });
    autoBotTask = cron.schedule("*/30 * * * *", () => autoRunCrawler());
    isBotRunning = true;
    return res
      .status(200)
      .json({ success: true, message: "Đã BẬT Auto-Pilot." });
  }
  if (action === "stop") {
    if (!isBotRunning)
      return res.status(400).json({ success: false, message: "Bot đã tắt!" });
    autoBotTask.stop();
    isBotRunning = false;
    return res
      .status(200)
      .json({ success: true, message: "Đã TẮT Auto-Pilot." });
  }
};

const getBotStatus = (req, res) =>
  res.status(200).json({ success: true, isRunning: isBotRunning });

module.exports = {
  runCrawlerBot,
  autoRunCrawler,
  getPendingRooms,
  approveRoom,
  toggleAutoBot,
  getBotStatus,
  deleteRoom,
  getAllUsers,
  getAllRooms,
  updateRoomStatus
};
