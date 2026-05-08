// backend/src/services/crawler/scraper.js
const { autoScroll } = require('./utils');

async function scrapeFacebookGroup(page, url) {
    console.log(`\n[Scraper] Truy cập URL: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Đóng Popup đăng nhập che màn hình
    try {
        await page.waitForSelector('div[aria-label="Đóng"], div[aria-label="Close"]', { timeout: 3000 });
        await page.click('div[aria-label="Đóng"], div[aria-label="Close"]');
        console.log('[Bypass] Đã đóng Popup đăng nhập!');
    } catch (e) {
        console.log('[Bypass] Không có Popup, tiếp tục...');
    }

    // Cuộn trang để lấy bài cũ
    await autoScroll(page, 8); 

    // Bóc tách DOM
    const scrapedPosts = await page.evaluate(() => {
        let postElements = Array.from(document.querySelectorAll('[role="article"], article, .post-item'));
        if (postElements.length === 0) postElements = [document.body]; // Single post fallback

        const recentPosts = [];

        postElements.forEach(post => {
            if (!post) return;
            const fullText = post.innerText || '';
            const headerText = fullText.substring(0, 200).toLowerCase();
            let isRecent = false;

            // Bộ lọc thời gian (2 ngày)
            if (headerText.includes('vừa xong') || headerText.includes('phút') || 
                headerText.includes('giờ') || headerText.includes('hôm qua')) {
                isRecent = true; 
            } else {
                const dayMatch = headerText.match(/(\d+)\s*ngày/);
                if (dayMatch && parseInt(dayMatch[1]) <= 2) isRecent = true;
            }

            if (postElements.length === 1) isRecent = true;

            if (isRecent && fullText.length > 50) {
                // Lấy Link bài viết (để chống trùng)
                let postUrl = '';
                const linkObj = post.querySelector('a[href*="/groups/"][href*="/posts/"], a[href*="/permalink/"]');
                if (linkObj) postUrl = linkObj.href.split('?')[0];

                // Lấy Hình ảnh Facebook CDN
                const imagesSet = new Set();
                post.querySelectorAll('img').forEach(img => {
                    const src = img.src || img.getAttribute('data-src') || '';
                    const lowerSrc = src.toLowerCase();
                    if (src.startsWith('http')) {
                        const isNotIcon = !lowerSrc.includes('rsrc.php') && !lowerSrc.includes('emoji') && 
                                          !lowerSrc.includes('icon') && !lowerSrc.includes('logo');
                        if (isNotIcon && (lowerSrc.includes('fbcdn.net') || !lowerSrc.includes('facebook.com'))) {
                            imagesSet.add(src);
                        }
                    }
                });

                // Lưu dữ liệu (Cho phép ảnh rỗng)
                recentPosts.push({ 
                    text: fullText, 
                    images: Array.from(imagesSet).slice(0, 8),
                    postUrl: postUrl // Gửi kèm link gốc để check duplicate
                });
            }
        });

        return recentPosts.slice(0, 10); // Lấy tối đa 10 bài
    });

    console.log(`[Success] Cào thành công ${scrapedPosts.length} bài đăng!`);
    return scrapedPosts;
}

module.exports = { scrapeFacebookGroup };