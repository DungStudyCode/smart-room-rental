// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components (Đã tạo Navbar, Footer)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// Layouts (Đã tạo)
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import HostLayout from './layouts/HostLayout';

// Pages - Public (Đã tạo HomePage)
import HomePage from './pages/HomePage'; // PB03, PB20
import RoomDetail from './pages/RoomDetail'; // PB04, PB17
// import MapSearch from './pages/MapSearch'; // PB05
// import Login from './pages/Login'; // PB02
// import Register from './pages/Register'; // PB01

// Pages - Private (User/Landlord) - Chưa tạo
// import Profile from './pages/Profile'; // PB08
// import SavedRooms from './pages/SavedRooms'; // PB06
// import RoommateFinder from './pages/RoommateFinder'; // PB09
// import Chats from './pages/Chats'; // PB18

// Pages - Host - Chưa tạo
// import MyPosts from './pages/host/MyPosts'; // PB07
// import CreatePost from './pages/host/CreatePost'; // PB07

// Pages - Admin - Chưa tạo
// import AdminDashboard from './pages/admin/AdminDashboard'; // PB15
import CrawlerManager from './pages/admin/CrawlerManager'; // PB11 (Ưu tiên 1)
import AIPendingList from './pages/admin/AIPendingList'; // PB12 (Ưu tiên 1)
// import ManageUsers from './pages/admin/ManageUsers'; // PB13
// import ManagePosts from './pages/admin/ManagePosts'; // PB14

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* PUBLIC ROUTES (Khách truy cập) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          {/* Mở comment khi nào bạn code xong các trang này */}
          <Route path="phong-tro/:id" element={<RoomDetail />} />
          {/* <Route path="ban-do" element={<MapSearch />} /> */}
          {/* <Route path="o-ghep" element={<RoommateFinder />} /> */}
          {/* <Route path="login" element={<Login />} /> */}
          {/* <Route path="register" element={<Register />} /> */}
          
          {/* PRIVATE ROUTES (Yêu cầu đăng nhập User) */}
          {/* <Route path="ca-nhan" element={<Profile />} /> */}
          {/* <Route path="da-luu" element={<SavedRooms />} /> */}
          {/* <Route path="tin-nhan" element={<Chats />} /> */}
        </Route>

        {/* HOST ROUTES (Giao diện cho Chủ nhà) */}
        <Route path="/host" element={<HostLayout />}>
          {/* <Route path="tin-dang" element={<MyPosts />} /> */}
          {/* <Route path="dang-tin-moi" element={<CreatePost />} /> */}
        </Route>

        {/* ADMIN ROUTES (Giao diện Quản trị viên) */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* <Route index element={<AdminDashboard />} /> */}
          <Route path="crawler" element={<CrawlerManager />} />
          <Route path="ai-duyet-tin" element={<AIPendingList />} />
          {/* <Route path="users" element={<ManageUsers />} /> */}
          {/* <Route path="posts" element={<ManagePosts />} /> */}
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;