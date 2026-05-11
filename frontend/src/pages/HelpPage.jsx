// frontend/src/pages/HelpPage.jsx
import { useState } from 'react';
import { 
  FaSearch, 
  FaQuestionCircle, 
  FaUserAlt, 
  FaHome, 
  FaShieldAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaChevronDown, 
  FaChevronUp 
} from 'react-icons/fa';

const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const categories = [
    { icon: <FaUserAlt className="text-blue-500" />, title: "Tài khoản", desc: "Quản lý thông tin cá nhân và mật khẩu." },
    { icon: <FaHome className="text-purple-500" />, title: "Đăng tin", desc: "Hướng dẫn đăng bài và quản lý phòng trọ." },
    { icon: <FaSearch className="text-green-500" />, title: "Tìm kiếm", desc: "Cách lọc phòng trọ hiệu quả và nhanh nhất." },
    { icon: <FaShieldAlt className="text-red-500" />, title: "An toàn", desc: "Mẹo tránh lừa đảo và bảo mật tài khoản." },
  ];

  const faqs = [
    {
      q: "Làm thế nào để đăng tin cho thuê phòng?",
      a: "Bạn cần đăng nhập với tài khoản 'Chủ nhà', sau đó chọn mục 'Đăng tin mới' trong Bảng điều khiển. Điền đầy đủ thông tin và hình ảnh, tin của bạn sẽ được hiển thị sau khi Admin duyệt."
    },
    {
      q: "Tôi có mất phí khi đăng tin không?",
      a: "Hiện tại TroSmart đang hỗ trợ đăng tin hoàn toàn miễn phí cho tất cả chủ trọ tại khu vực Đà Nẵng."
    },
    {
      q: "Làm sao để liên hệ với người cho thuê?",
      a: "Trong mỗi bài đăng chi tiết, chúng tôi đều cung cấp số điện thoại hoặc nút liên hệ trực tiếp với chủ trọ. Bạn có thể gọi điện hoặc nhắn tin qua Zalo."
    },
    {
      q: "Hệ thống 'Duyệt tin tự động AI' là gì?",
      a: "Đây là công nghệ sử dụng AI để kiểm tra nội dung và hình ảnh tin đăng ngay lập tức, giúp loại bỏ các tin rác hoặc tin lừa đảo trước khi đến mắt người dùng."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 1. HERO SECTION */}
      <div className="bg-purple-700 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Chúng tôi có thể giúp gì cho bạn?</h1>
          <div className="relative max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="Nhập câu hỏi hoặc vấn đề của bạn..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl shadow-lg outline-none focus:ring-2 focus:ring-purple-400 transition-all text-gray-700"
            />
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* 2. CATEGORIES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{cat.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 3. FAQ SECTION */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <FaQuestionCircle className="text-purple-600" /> Câu hỏi thường gặp
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-700">{faq.q}</span>
                    {openFaq === idx ? <FaChevronUp className="text-purple-600" /> : <FaChevronDown className="text-gray-400" />}
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 4. CONTACT SUPPORT */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 sticky top-24 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Vẫn cần hỗ trợ?</h2>
              <p className="text-sm text-gray-500 mb-8">
                Nếu không tìm thấy câu trả lời, đừng ngần ngại liên hệ trực tiếp với đội ngũ TroSmart.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <FaPhoneAlt size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Hotline 24/7</p>
                    <p className="font-bold text-gray-800">0905 123 456</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <FaEnvelope size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Email hỗ trợ</p>
                    <p className="font-bold text-gray-800">support@trosmart.com</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-10 bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200">
                Gửi tin nhắn cho chúng tôi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;