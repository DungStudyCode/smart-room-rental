// backend/src/services/crawler/browser.js
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

// Đường dẫn lưu file cookie ở thư mục gốc backend
const COOKIE_PATH = path.join(__dirname, '../../../cookies.json'); 

async function initBrowser() {
    console.log('[Browser] Khởi động trình duyệt Headless...');
    const browser = await puppeteer.launch({ 
        headless: "new", // Đổi thành false nếu bạn muốn xem nó chạy
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--window-size=1920,1080',
            '--lang=vi-VN,vi' // Ép tiếng Việt để parse thời gian chuẩn
        ]
    });
    
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'vi-VN,vi;q=0.9' });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Nạp Cookie (Session Persistence)
    if (fs.existsSync(COOKIE_PATH)) {
        console.log('[Session] Tìm thấy Cookie, đang nạp phiên đăng nhập cũ...');
        const cookiesString = fs.readFileSync(COOKIE_PATH);
        const cookies = JSON.parse(cookiesString);
        await page.setCookie(...cookies);
    } else {
        console.log('[Session] Không tìm thấy Cookie, truy cập dưới dạng Khách.');
    }

    return { browser, page };
}

// (Tùy chọn) Hàm này chạy 1 lần để tạo cookie, sau đó lưu lại
async function saveCookies(page) {
    const cookies = await page.cookies();
    fs.writeFileSync(COOKIE_PATH, JSON.stringify(cookies, null, 2));
    console.log('[Session] Đã lưu Cookie mới thành công!');
}

module.exports = { initBrowser, saveCookies };