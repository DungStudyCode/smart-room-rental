// backend/src/services/crawler/scraper.js

async function scrapeFacebookGroup(page, url) {
    // 1. ÉP BOT QUAY LẠI GIAO DIỆN MÁY TÍNH (WWW) VÌ CÓ F12 BẢO KÊ
    const desktopUrl = url.replace('mbasic.facebook.com', 'www.facebook.com').replace('m.facebook.com', 'www.facebook.com');
    console.log(`\n[Scraper] Truy cập URL Desktop: ${desktopUrl}`);

    // Mở to màn hình để Facebook render đầy đủ
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(desktopUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    // Đóng popup đăng nhập nếu bị làm phiền
    try {
        await page.waitForSelector('div[aria-label="Đóng"], div[aria-label="Close"]', { timeout: 3000 });
        await page.click('div[aria-label="Đóng"], div[aria-label="Close"]');
        console.log('[Bypass] Đã đóng Popup Đăng nhập/Tham gia nhóm.');
    } catch (e) {
        // Bỏ qua nếu không có popup
    }

    console.log('⏳ [Action] Đang tải giao diện Facebook...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // =========================================================
    // 2. CUỘN TRANG LẤY SỐ LƯỢNG (SCROLL)
    // =========================================================
    console.log('[Action] Đang lướt chuột để tải thêm bài viết...');
    const scrollTimes = 5; // Lướt 5 lần (Khoảng 10-15 bài)
    
    for (let i = 0; i < scrollTimes; i++) {
        await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight || window.innerHeight * 2));
        await new Promise(resolve => setTimeout(resolve, 2500)); // Chờ ảnh và text render
    }

    // =========================================================
    // 3. CLICK TỰ ĐỘNG VÀO CÁC NÚT "XEM THÊM"
    // =========================================================
    console.log('[Action] Đang bấm "Xem thêm" để bung toàn bộ nội dung...');
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('div[role="button"]'));
        buttons.forEach(btn => {
            const text = btn.innerText || '';
            if (text.toLowerCase() === 'xem thêm' || text.toLowerCase() === 'see more') {
                try { btn.click(); } catch(e) {}
            }
        });
    });
    // Chờ 2 giây cho text xổ ra hết
    await new Promise(resolve => setTimeout(resolve, 2000));

    // =========================================================
    // 4. BÓC TÁCH DỮ LIỆU DỰA TRÊN HTML (F12 CỦA BẠN)
    // =========================================================
    console.log('[Action] Bắt đầu trích xuất dữ liệu qua DOM...');
    const scrapedPosts = await page.evaluate(() => {
        // BẮT ĐÚNG THẺ aria-posinset CHỨA TỪNG BÀI VIẾT
        const postElements = Array.from(document.querySelectorAll('div[aria-posinset]'));
        const posts = [];

        postElements.forEach(post => {
            // LẤY TEXT TỪ THẺ VÀNG: data-ad-rendering-role="story_message"
            const messageBox = post.querySelector('div[data-ad-rendering-role="story_message"]');
            if (!messageBox) return; // Không có nội dung thì bỏ qua
            
            const fullText = messageBox.innerText || '';
            if (fullText.length < 30) return; // Bài quá ngắn bỏ qua

            // LẤY ẢNH (Bỏ qua emoji lửa, icon facebook)
            const imagesSet = new Set();
            post.querySelectorAll('img').forEach(img => {
                const src = img.src || '';
                // Nhặt ảnh thật (scontent) và vứt bỏ icon/emoji (static.xx)
                if (src.includes('scontent') && !src.includes('emoji.php')) {
                    imagesSet.add(src);
                }
            });

            // TÌM LINK GỐC (Dựa vào mẹo ID pcb.1234567 của bạn)
            let postUrl = '';
            const allLinks = Array.from(post.querySelectorAll('a[href]'));
            for (let a of allLinks) {
                const href = a.href;
                // Tìm đoạn set=pcb.ID_BAI_VIET trong link ảnh
                const pcbMatch = href.match(/set=pcb\.(\d+)/) || href.match(/multi_permalinks=(\d+)/);
                if (pcbMatch) {
                    const postId = pcbMatch[1];
                    // Ghép lại thành link Facebook chuẩn
                    postUrl = `https://www.facebook.com/groups/phongtrodanang/permalink/${postId}/`;
                    break;
                }
                
                // Backup nếu FB hiện link permalink trực tiếp
                if (href.includes('/permalink/') || href.includes('/posts/')) {
                    postUrl = href.split('?')[0];
                }
            }

            posts.push({
                text: fullText,
                images: Array.from(imagesSet).slice(0, 8), // Lấy max 8 ảnh
                postUrl: postUrl || 'URL_NOT_FOUND'
            });
        });

        return posts;
    });

    console.log(`[Info] Đã nhặt được ${scrapedPosts.length} bài. Đang kiểm tra nội dung...`);

    // =========================================================
    // 5. LỌC ĐÚNG MỤC TIÊU PHÒNG TRỌ & CHỐNG TRÙNG
    // =========================================================
    const uniquePosts = [];
    const seenUrls = new Set();

    for (const post of scrapedPosts) {
        if (post.postUrl !== 'URL_NOT_FOUND' && seenUrls.has(post.postUrl)) continue;
        if (post.postUrl !== 'URL_NOT_FOUND') seenUrls.add(post.postUrl);

        const textLower = post.text.toLowerCase();
        const hasPhone = post.text.match(/(0[0-9\s\.\-]{9,13})/);
        const isRelated = textLower.includes('trọ') || textLower.includes('thuê') || textLower.includes('phòng');

        // Phải có 1 trong 2: SĐT hoặc Từ khóa liên quan
        if (hasPhone || isRelated) {
            uniquePosts.push(post);
            console.log(`[Success] + Lấy thành công 1 bài (Độ dài: ${post.text.length} ký tự | ${post.images.length} ảnh)`);
        }
    }

    console.log(`\n🎉 [Scraper Hoàn tất] Thu được tổng cộng: ${uniquePosts.length} bài đăng chất lượng.`);
    return uniquePosts;
}

module.exports = { scrapeFacebookGroup };