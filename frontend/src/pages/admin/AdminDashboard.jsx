// frontend/src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaBuilding, FaClock, FaCheckCircle, FaSpinner, FaArrowRight, FaShieldAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    pendingRooms: 0,
    activeRooms: 0,
    systemStatus: 'Đang kết nối...'
  });
  const [loading, setLoading] = useState(true);

  // Lấy thông tin Admin từ LocalStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        // 👉 THÊM DÒNG NÀY ĐỂ XEM DỮ LIỆU BACKEND TRẢ VỀ:
        console.log("Dữ liệu từ Backend:", data); 

        if (data.success) {
          setStats(data.data);
        } else {
          // 👉 THÊM DÒNG NÀY ĐỂ BÁO LỖI LÊN UI:
          setStats(prev => ({ ...prev, systemStatus: data.message || "Lỗi xác thực" }));
        }
      } catch (error) {
        console.error("Lỗi fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <FaSpinner className="animate-spin text-purple-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-lg flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <FaShieldAlt className="text-purple-400 text-2xl" />
            <h1 className="text-3xl font-bold">Xin chào, {user.fullName || 'Admin'}!</h1>
          </div>
          <p className="text-gray-400">Đây là trung tâm chỉ huy. Chúc bạn một ngày làm việc hiệu quả.</p>
        </div>
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <FaShieldAlt className="text-[150px]" />
        </div>
      </div>

      {/* QUICK ALERT SECTION (Cảnh báo việc cần làm) */}
      {stats.pendingRooms > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xl">
              <FaClock />
            </div>
            <div>
              <h3 className="font-bold text-orange-800 text-lg">Cần chú ý: Tin đăng mới chờ duyệt!</h3>
              <p className="text-orange-600 text-sm">Hệ thống đang có <span className="font-bold text-xl">{stats.pendingRooms}</span> phòng trọ mới cần bạn kiểm tra và phê duyệt.</p>
            </div>
          </div>
          <Link to="/admin/ai-duyet-tin" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-sm">
            Duyệt tin ngay <FaArrowRight />
          </Link>
        </div>
      )}

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">
              <FaUsers />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Tổng Thành Viên</p>
          <h3 className="text-3xl font-black text-gray-800">{stats.totalUsers.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl">
              <FaBuilding />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Tổng Số Bài Đăng</p>
          <h3 className="text-3xl font-black text-gray-800">{stats.totalRooms.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-xl">
              <FaCheckCircle />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Tin Đang Hiển Thị</p>
          <h3 className="text-3xl font-black text-gray-800">{stats.activeRooms.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Trạng thái Server</p>
          <div className="flex items-center gap-3">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
            </span>
            <span className="text-lg font-bold text-gray-800">{stats.systemStatus}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">Dữ liệu được cập nhật theo thời gian thực.</p>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;