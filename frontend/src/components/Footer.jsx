import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#F8F5FC] border-t border-purple-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Left Side */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-purple-700 mb-1">TroSmart</h2>
          <p className="text-gray-500 text-sm">© 2026 TroSmart. All rights reserved.</p>
        </div>

        {/* Right Side Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 font-medium">
          <Link to="/terms" className="hover:text-purple-600 transition-colors">Điều khoản sử dụng</Link>
          <Link to="/privacy" className="hover:text-purple-600 transition-colors">Chính sách bảo mật</Link>
          <Link to="/support" className="hover:text-purple-600 transition-colors">Liên hệ trợ giúp</Link>
          <Link to="/about" className="hover:text-purple-600 transition-colors">Về chúng tôi</Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;