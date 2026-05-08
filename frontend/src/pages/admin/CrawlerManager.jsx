//frontend/src/pages/admin/CrawlerManager.jsx
import { useState, useEffect } from 'react';
import { FaRobot, FaPlay, FaTerminal, FaSpinner } from 'react-icons/fa';

const CrawlerManager = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), text: "Hệ thống Crawler Bot sẵn sàng...", type: 'info' }
  ]);

  // --- THÊM STATE CHO AUTO-PILOT BOT ---
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [botLoading, setBotLoading] = useState(false);

  // --- LẤY TRẠNG THÁI BOT KHI LOAD TRANG ---
  useEffect(() => {
    const fetchBotStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/bot/status');
        const data = await response.json();
        if (data.success) {
          setIsBotRunning(data.isRunning);
        }
      } catch (error) {
        console.error("Lỗi lấy trạng thái Bot:", error);
      }
    };
    fetchBotStatus();
  }, []);

  const addLog = (text, type = 'info') => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text, type }]);
  };

  // --- HÀM XỬ LÝ NÚT BẬT/TẮT BOT TỰ ĐỘNG ---
  const handleToggleBot = async () => {
    setBotLoading(true);
    const action = isBotRunning ? 'stop' : 'start';
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/bot/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await response.json();

      if (data.success) {
        setIsBotRunning(!isBotRunning);
        addLog(`[Auto-Pilot] ${data.message}`, "success");
      } else {
        addLog(`[Lỗi Bot] ${data.message}`, "error");
      }
    } catch (error) {
      console.error("Lỗi khi toggle Bot:", error);
      addLog(`[LỖI MẠNG] Không thể kết nối đến Backend Node.js`, "error");
    } finally {
      setBotLoading(false);
    }
  };

  // --- HÀM XỬ LÝ CÀO THỦ CÔNG CŨ ---
  const handleStartCrawler = async () => {
    if (!url) {
      addLog("Lỗi: Vui lòng nhập URL cần cào!", "error");
      return;
    }

    setLoading(true);
    addLog(`Đang khởi động Headless Browser để truy cập: ${url}`, "info");
    
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
        // Tùy chỉnh log dựa trên việc cào được mảng hay 1 object
        const msg = data.data.length ? `Đã bóc tách được ${data.data.length} phòng` : `Đã bóc tách được phòng [${data.data.title}]`;
        addLog(`THÀNH CÔNG: ${msg}`, "success");
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
        <div className="flex flex-col gap-6">
          
          {/* PANEL 1: ĐIỀU KHIỂN AUTO-PILOT */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 h-fit relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${isBotRunning ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
            <div className="flex justify-between items-start mb-2 pl-2">
              <div>
                <h2 className="font-bold text-gray-800">Bot Auto-Pilot</h2>
                <p className="text-xs text-gray-500 mt-1">Tự động quét Group FB & Web định kỳ 30 phút/lần.</p>
              </div>
              
              {/* Nút Toggle Switch CSS */}
              <button 
                onClick={handleToggleBot}
                disabled={botLoading}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none shrink-0 mt-1 ${isBotRunning ? 'bg-purple-600' : 'bg-gray-300'} ${botLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span 
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isBotRunning ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </button>
            </div>
            <div className="pl-2 mt-3 flex items-center">
              <span className="relative flex h-3 w-3 mr-2">
                {isBotRunning && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isBotRunning ? 'bg-purple-600' : 'bg-gray-400'}`}></span>
              </span>
              <span className="text-sm font-medium text-gray-600">
                Trạng thái: {isBotRunning ? 'Đang hoạt động' : 'Đang ngủ'}
              </span>
            </div>
          </div>

          {/* PANEL 2: ĐIỀU KHIỂN THỦ CÔNG */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="font-bold text-gray-700 mb-4">Cào dữ liệu thủ công</h2>
            
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
        </div>

        {/* Cột phải: Terminal Log */}
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl shadow-lg overflow-hidden flex flex-col h-[500px]">
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