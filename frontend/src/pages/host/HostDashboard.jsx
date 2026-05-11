// frontend/src/pages/host/HostDashboard.jsx
import { useState, useEffect } from 'react';
import { FaBuilding, FaEye, FaCalendarCheck, FaMoneyBillWave, FaInbox, FaChartLine, FaSpinner } from 'react-icons/fa';

const HostDashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalViews: 0,
    totalBookings: 0,
    expectedRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/host/dashboard-stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Bắt buộc gửi kèm token để BE biết là ai
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] bg-[#f8f9fa]">
        <FaSpinner className="animate-spin text-purple-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 bg-[#f8f9fa] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-500 mt-2">Xem lại tình trạng hoạt động các bất động sản của bạn.</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Tổng số tin */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
            <FaBuilding size={18} />
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Tổng số tin đăng</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalRooms}</h3>
        </div>

        {/* Card 2: Lượt xem */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center mb-4">
            <FaEye size={18} />
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Tổng lượt xem</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalViews}</h3>
        </div>

        {/* Card 3: Lượt đặt / Đã thuê */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
            <FaCalendarCheck size={18} />
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Số phòng đã cho thuê</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalBookings}</h3>
        </div>

        {/* Card 4: Doanh thu (Màu nổi bật) */}
        <div className="bg-purple-600 p-6 rounded-2xl shadow-md shadow-purple-200 text-white flex flex-col justify-between hover:scale-[1.02] transition-transform">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
            <FaMoneyBillWave size={18} />
          </div>
          <p className="text-white/80 text-sm font-medium mb-1">Doanh thu dự kiến</p>
          <h3 className="text-2xl font-bold">{stats.expectedRevenue.toLocaleString('vi-VN')} đ</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* HOẠT ĐỘNG GẦN ĐÂY */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-[400px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
            <FaInbox size={24} />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">Chưa có hoạt động mới</h3>
          <p className="text-sm text-gray-500">Mọi thông báo về đặt phòng và tin nhắn sẽ xuất hiện tại đây.</p>
        </div>

        {/* PHÂN TÍCH */}
        <div className="lg:col-span-1 bg-[#f3f0f7] rounded-2xl border border-purple-50 p-6 h-[400px] flex flex-col items-center justify-center text-center">
           <FaChartLine size={48} className="text-purple-200 mb-4" />
           <p className="text-sm font-medium text-purple-800">Dữ liệu phân tích biểu đồ đang được cập nhật</p>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;