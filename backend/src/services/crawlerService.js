const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Kích hoạt Plugin Tàng hình để tránh bị phát hiện là Bot
puppeteer.use(StealthPlugin());

/**
 * Unified Crawler Service: Hợp nhất cào Facebook & Website rao vặt
 * @param {string} url - Đường dẫn cần lấy dữ liệu
 */
const scrapeDataFromUrl = async (url) => {
  console.log(`[Hybrid Crawler] Đang xử lý mục tiêu: ${url}`);
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: "new", // Chế độ chạy ngầm bản mới
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--window-size=1920,1080',
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    });
    
    const page = await browser.newPage();
    
    // 1. Cấu hình User-Agent để giả dạng trình duyệt Windows/Chrome thật
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // 2. Phân loại chiến thuật (Strategy Selection)
    if (url.includes('facebook.com')) {
      console.log('[Strategy] Áp dụng kỹ thuật Bypass Facebook Login Wall...');
      // Facebook thường chặn ngay lập tức nếu thấy Bot. 
      // Kỹ thuật: Chờ đợi nội dung cụ thể hoặc giả lập hành vi cuộn trang.
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Giả lập cuộn trang để kích hoạt load dữ liệu
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await new Promise(r => setTimeout(r, 2000));
    } else {
      console.log('[Strategy] Áp dụng kỹ thuật Standard Web Scraping cho Website rao vặt...');
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    }

    // 3. Trích xuất Text (Data Extraction)
    // AI Gemini sẽ xử lý phần "rác" trong text này để lấy JSON chuẩn
    const rawText = await page.evaluate(() => {
      // Ưu tiên lấy text ở các thẻ chứa nội dung chính để giảm noise cho AI
      const mainContent = document.querySelector('main') || document.querySelector('article') || document.body;
      return mainContent.innerText;
    });

    console.log(`[Success] Đã lấy được ${rawText.length} ký tự dữ liệu thô.`);
    return rawText;

  } catch (error) {
    console.error('[Critical Error] Crawler thất bại:', error.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = { scrapeDataFromUrl };