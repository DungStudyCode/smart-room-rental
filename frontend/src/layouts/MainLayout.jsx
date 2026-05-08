import { Outlet } from 'react-router-dom';
import ChatbotWidget from '../components/ChatbotWidget';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Tạm thời để Navbar giả */}

      {/* Nội dung các trang con sẽ được render ở thẻ Outlet này */}
      <main className="flex-grow relative">
        <Outlet />
      </main>

      {/* Tạm thời để Footer giả */}
      <footer className="bg-gray-900 text-gray-400 p-6 text-center text-sm">
        © 2026 Đồ án môn học - Sinh viên ĐH Duy Tân
      </footer>

      {/* Đặt Chatbot ở Layout để trang nào cũng có */}
      <ChatbotWidget />
    </div>
  );
};

export default MainLayout;