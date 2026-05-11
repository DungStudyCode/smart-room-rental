// frontend/src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 
import ChatbotWidget from '../components/ChatbotWidget';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* Đảm bảo Main luôn giãn hết cỡ để đẩy Footer xuống đáy */}
      <main className="flex-1 flex flex-col bg-white w-full">
        <Outlet />
      </main>

      <Footer />
      <ChatbotWidget />
    </div>
  );
};

export default MainLayout;