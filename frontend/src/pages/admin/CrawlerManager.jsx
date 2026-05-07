//frontend/src/pages/admin/CrawlerManager.jsx
import { useState } from 'react';
import { FaRobot, FaPlay, FaTerminal, FaSpinner } from 'react-icons/fa';

const CrawlerManager = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), text: "Hệ thống Crawler Bot sẵn sàng...", type: 'info' }
  ]);

  const addLog = (text, type = 'info') => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text, type }]);
  };

  const handleStartCrawler = async () => {
    if (!url) {
      addLog("Lỗi: Vui lòng nhập URL cần cào!", "error");
      return;
    }

    setLoading(true);
    addLog(`Đang khởi động Headless Browser để truy cập: ${url}`, "info");
    
    // Tạm thời hiển thị log giả lập cho sinh động
    setTimeout(() => addLog("Đang trích xuất nội dung HTML...", "info"), 1500);
    setTimeout(() => addLog("Đang gửi dữ liệu thô sang Gemini AI để bóc tách JSON...", "warning"), 3000);

    try {
      const response = await fetch('http://localhost:5000/api/admin/run-crawler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (data.success) {
        addLog(`THÀNH CÔNG: Đã bóc tách được phòng [${data.data.title}] với giá ${data.data.price} VNĐ`, "success");
        addLog(`Dữ liệu đã được lưu vào MongoDB (Trạng thái: PENDING)`, "success");
      } else {
        addLog(`THẤT BẠI: ${data.error || data.message}`, "error");
      }
    } catch (error) {
      console.error("Fetch error details:", error);
      addLog(`LỖI MẠNG: Không thể kết nối đến Backend Node.js`, "error");
    } finally {
      setLoading(false);
      setUrl('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaRobot className="mr-2 text-purple-600" /> Quản lý Bot Thu thập dữ liệu
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái: Bảng điều khiển */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="font-bold text-gray-700 mb-4">Điều khiển thủ công</h2>
          
          <label className="block text-sm font-medium text-gray-600 mb-2">URL Bài post (Facebook / Chotot)</label>
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 mb-4 focus:outline-none focus:border-purple-500 text-sm"
          />

          <button 
            onClick={handleStartCrawler}
            disabled={loading}
            className={`w-full flex items-center justify-center font-bold py-3 rounded-xl transition-colors ${loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaPlay className="mr-2" />}
            {loading ? 'Hệ thống đang chạy...' : 'Tiến hành cào dữ liệu'}
          </button>
        </div>

        {/* Cột phải: Terminal Log */}
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl shadow-lg overflow-hidden flex flex-col h-[400px]">
          <div className="bg-gray-800 px-4 py-2 flex items-center border-b border-gray-700 shrink-0">
            <FaTerminal className="text-gray-400 mr-2" />
            <span className="text-xs font-mono text-gray-400">crawler_bot_log.exe</span>
          </div>
          
          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto flex flex-col gap-2">
            {logs.map((log, index) => (
              <div key={index} className={`flex items-start ${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : log.type === 'warning' ? 'text-yellow-400' : 'text-gray-300'}`}>
                <span className="text-gray-500 mr-3 shrink-0">[{log.time}]</span>
                <span>{log.text}</span>
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 animate-pulse mt-2">_</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrawlerManager;