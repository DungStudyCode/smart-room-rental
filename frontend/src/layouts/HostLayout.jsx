import { Outlet, Link } from 'react-router-dom';

const HostLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header riêng cho kênh Chủ nhà */}
      <header className="bg-purple-800 text-white p-4 shadow-md flex justify-between items-center px-8">
        <h1 className="text-xl font-bold tracking-tight">TroSmart - Kênh Chủ Nhà</h1>
        <nav className="flex gap-4 text-sm font-medium">
          <Link to="/" className="hover:text-purple-200">Về trang chủ</Link>
          <Link to="/host/tin-dang" className="hover:text-purple-200">Quản lý tin</Link>
          <Link to="/host/dang-tin-moi" className="bg-purple-600 px-4 py-2 rounded-full hover:bg-purple-500">Đăng tin mới</Link>
        </nav>
      </header>

      {/* Nội dung các trang con (MyPosts, CreatePost) sẽ render ở đây */}
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <Outlet /> 
      </main>
    </div>
  );
};

export default HostLayout;