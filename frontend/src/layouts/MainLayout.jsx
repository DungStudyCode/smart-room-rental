import { Outlet } from 'react-router-dom';
import ChatbotWidget from '../components/ChatbotWidget';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Tạm thời để Navbar giả */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center px-8 border-b border-gray-200">
        <h1 className="font-bold text-2xl text-purple-600 tracking-tight">TroSmart</h1>
        <nav className="flex gap-4 text-sm font-medium text-gray-600">
          <a href="/" className="hover:text-purple-600">Trang chủ</a>
          <a href="/ban-do" className="hover:text-purple-600">Bản đồ</a>
          <a href="/login" className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full hover:bg-purple-200">Đăng nhập</a>
        </nav>
      </header>

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