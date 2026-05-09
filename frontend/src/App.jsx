// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// // Components (Đã tạo Navbar, Footer)
// import Navbar from './components/navbar/Navbar';
// import Footer from './components/Footer';
// Layouts (Đã tạo)
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/admin/AdminLayout';
import HostLayout from './layouts/HostLayout';

// Pages - Public (Đã tạo HomePage)
import HomePage from './pages/HomePage'; // PB03, PB20
import RoomDetail from './pages/RoomDetail'; // PB04, PB17
// import MapSearch from './pages/MapSearch'; // PB05
import Login from './pages/Login'; // PB02
import Register from './pages/Register'; // PB01
import FindRoom from './pages/FindRoom'; // Trang tìm phòng

// (Các import comment khác giữ nguyên, mình ẩn bớt cho gọn)
import CrawlerManager from './pages/admin/CrawlerManager'; // PB11 (Ưu tiên 1)
import AIPendingList from './pages/admin/AIPendingList'; // PB12 (Ưu tiên 1)
import UserManager from './layouts/admin/UserManager'; // PB  13
import PostManager from './layouts/admin/PostManager'; // PB 14

//route logic kiểm tra trạng thái login
import ProtectedRoute from './router/ProtectedRoute';
function App() {
    return (
        <Router>
            <Routes>
                {/* PUBLIC ROUTES (Khách truy cập) - Bọc bởi MainLayout */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="tim-phong" element={<FindRoom />} />
                    <Route path="phong-tro/:id" element={<RoomDetail />} />
                    {/* <Route path="ban-do" element={<MapSearch />} /> */}
                    {/* <Route path="o-ghep" element={<RoommateFinder />} /> */}
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />

                    {/* PRIVATE ROUTES (Yêu cầu đăng nhập User) */}
                    <Route element={<ProtectedRoute />}>
                        {/* <Route path="ca-nhan" element={<Profile />} /> */}
                        {/* <Route path="da-luu" element={<SavedRooms />} /> */}
                        {/* <Route path="tin-nhan" element={<Chats />} /> */}
                    </Route>
                </Route>

                {/* HOST ROUTES (Giao diện cho Chủ nhà) - Bọc bởi HostLayout */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/host" element={<HostLayout />}>
                        {/* Các route của host sau này */}
                    </Route>
                </Route>

                {/* ADMIN ROUTES (Giao diện Quản trị viên) - Bọc bởi AdminLayout */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="users" element={<UserManager />} />
                    <Route path="posts" element={<PostManager />} />
                    <Route path="crawler" element={<CrawlerManager />} />
                    <Route path="ai-duyet-tin" element={<AIPendingList />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
