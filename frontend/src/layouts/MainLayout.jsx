// frontend/src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Gọi Navbar thật
import Footer from '../components/Footer'; // Gọi Footer thật
import ChatbotWidget from '../components/ChatbotWidget';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      
      {/* 1. Thanh Navbar chính thức */}
      <Navbar />

      {/* 2. Nội dung các trang con (HomePage, FindRoom) sẽ hiển thị ở đây */}
      <main className="flex-grow relative bg-white">
        <Outlet />
      </main>

      {/* 3. Chân trang Footer chính thức */}
      <Footer />

      {/* 4. Đặt Chatbot ở Layout để trang nào cũng có */}
      <ChatbotWidget />
      
    </div>
  );
};

export default MainLayout;