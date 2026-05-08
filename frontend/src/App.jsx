// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts (Đã tạo)
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import HostLayout from './layouts/HostLayout';

// Pages - Public (Đã tạo HomePage)
import HomePage from './pages/HomePage'; // PB03, PB20
import RoomDetail from './pages/RoomDetail'; // PB04, PB17
import FindRoom from './pages/FindRoom'; // Trang tìm phòng

// (Các import comment khác giữ nguyên, mình ẩn bớt cho gọn)
import CrawlerManager from './pages/admin/CrawlerManager'; // PB11 (Ưu tiên 1)
import AIPendingList from './pages/admin/AIPendingList'; // PB12 (Ưu tiên 1)

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES (Khách truy cập) - Bọc bởi MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="tim-phong" element={<FindRoom />} />
          <Route path="phong-tro/:id" element={<RoomDetail />} />
        </Route>

        {/* HOST ROUTES (Giao diện cho Chủ nhà) - Bọc bởi HostLayout */}
        <Route path="/host" element={<HostLayout />}>
          {/* Các route của host sau này */}
        </Route>

        {/* ADMIN ROUTES (Giao diện Quản trị viên) - Bọc bởi AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="crawler" element={<CrawlerManager />} />
          <Route path="ai-duyet-tin" element={<AIPendingList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;