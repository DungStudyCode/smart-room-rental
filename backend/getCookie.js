// File: backend/getCookie.js
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

async function getFBCookie() {
    console.log("🚀 Đang mở trình duyệt. Vui lòng đăng nhập Facebook bằng nick Clone...");
    
    const browser = await puppeteer.launch({ 
        headless: false, // Phải để false để nó hiện cửa sổ Chrome lên cho bạn thao tác
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--window-size=1200,800']
    });
    
    const page = await browser.newPage();
    
    // Mở trang đăng nhập Facebook
    await page.goto('https://www.facebook.com/', { waitUntil: 'networkidle2' });
    
    console.log("⏳ Bạn có 60 giây để nhập Email, Mật khẩu và bấm Đăng nhập...");
    
    // Chờ 60 giây để bạn thao tác tay. Trình duyệt tự hiểu khi bạn vào được Newsfeed.
    try {
        await page.waitForNavigation({ timeout: 60000, waitUntil: 'networkidle2' });
    } catch (error) {
        console.log("Hết thời gian chờ chờ load trang, vẫn tiếp tục lấy cookie...");
    }

    // Lấy toàn bộ Cookie của phiên đăng nhập đó
    const cookies = await page.cookies();
    
    // Lưu ra file cookies.json ở ngay thư mục backend
    fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2));
    
    console.log("✅ TUYỆT VỜI! Đã lưu Cookie thành công vào file cookies.json.");
    await browser.close();
}

getFBCookie();