Dự án ứng dụng MERN Stack kết hợp Google Gemini AI để tự động hóa việc tìm kiếm và quản lý phòng trọ.

## 🛠 Công nghệ sử dụng
- **Frontend:** ReactJS (Vite), Tailwind CSS.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas.
- **AI:** Google Gemini Pro (RAG Architecture).
- **Crawler:** Puppeteer (Stealth mode).

## ⚙️ Cấu hình triển khai (Deployment)
### Backend (Render)
1. Kết nối GitHub với Render.
2. Thiết lập **Build Command**: `npm install`
3. Thiết lập **Start Command**: `node server.js`
4. Thêm các **Environment Variables**: `MONGO_URI`, `GEMINI_API_KEY`.

### Frontend (Vercel)
1. Kết nối GitHub với Vercel.
2. Vercel sẽ tự động nhận diện Vite và build dự án.