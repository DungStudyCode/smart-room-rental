// backend/src/services/crawler/utils.js

// Hàm nghỉ chính xác (ms)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Hàm nghỉ ngẫu nhiên để giả lập người thật (chống bị Facebook block)
const randomSleep = (min, max) => sleep(Math.floor(Math.random() * (max - min + 1)) + min);

// Hàm tự động cuộn trang (Infinite Scroll)
async function autoScroll(page, maxScrolls = 5) {
    console.log(`[Action] Bắt đầu cuộn trang ${maxScrolls} lần...`);
    for (let i = 0; i < maxScrolls; i++) {
        await page.evaluate(() => window.scrollBy(0, 1000));
        await randomSleep(1500, 3000); // Ngừng ngẫu nhiên 1.5s - 3s
    }
}

module.exports = { sleep, randomSleep, autoScroll };