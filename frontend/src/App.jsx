// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import HostLayout from './layouts/HostLayout';

// Pages - Public
import HomePage from './pages/HomePage'; 
import RoomDetail from './pages/RoomDetail'; 
import Login from './pages/Login'; 
import Register from './pages/Register'; 
import FindRoom from './pages/FindRoom'; 
import HelpPage from './pages/HelpPage'; // 👈 ĐÃ THÊM IMPORT TRANG TRỢ GIÚP

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard'; 
import CrawlerManager from './pages/admin/CrawlerManager'; 
import AIPendingList from './pages/admin/AIPendingList'; 
import UserManager from './pages/admin/UserManager'; 
import PostManager from './pages/admin/PostManager'; 

// Pages - Host
import HostDashboard from './pages/host/HostDashboard';
import HostMyPosts from './pages/host/HostMyPosts';
import HostCreateRoom from './pages/host/HostCreateRoom';
import HostSettings from './pages/host/HostSettings';

// Route Guards
import ProtectedRoute from './router/ProtectedRoute';
import AdminRoute from './router/AdminRoute';

function App() {
    return (
        <Router>
            <Routes>
                {/* 🌟 MAINLAYOUT BAO BỌC TOÀN BỘ ỨNG DỤNG CỦA BẠN */}
                <Route path="/" element={<MainLayout />}>
                    
                    {/* 1. PUBLIC ROUTES */}
                    <Route index element={<HomePage />} />
                    <Route path="tim-phong" element={<FindRoom />} />
                    <Route path="phong-tro/:id" element={<RoomDetail />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="tro-giup" element={<HelpPage />} /> {/* 👈 ĐÃ THÊM ROUTE CHO TRANG TRỢ GIÚP */}

                    {/* PRIVATE ROUTES CỦA USER */}
                    <Route element={<ProtectedRoute />}>
                        {/* Các route của user sau này ví dụ: Profile, Favorites... */}
                    </Route>

                    {/* 2. HOST ROUTES */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="host" element={<HostLayout />}>
                            <Route index element={<HostDashboard />} />
                            <Route path="tin-dang" element={<HostMyPosts />} />
                            <Route path="dang-tin" element={<HostCreateRoom />} />
                            <Route path="cai-dat" element={<HostSettings />} />
                        </Route>
                    </Route>

                    {/* 3. ADMIN ROUTES */}
                    <Route element={<AdminRoute />}>
                        <Route path="admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} /> 
                            <Route path="users" element={<UserManager />} />
                            <Route path="posts" element={<PostManager />} />
                            <Route path="crawler" element={<CrawlerManager />} />
                            <Route path="ai-duyet-tin" element={<AIPendingList />} />
                        </Route>
                    </Route>

                </Route>
            </Routes>
        </Router>
    );
}

export default App;