//frontend/src/components/ChatbotWidget.jsx
import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(true); 
  const [input, setInput] = useState('');
  
  // Khởi tạo State chứa lịch sử tin nhắn
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Chào bạn! 👋 Mình là trợ lý AI của TroSmart. Bạn đang tìm phòng trọ khu vực nào hoặc với mức giá bao nhiêu?' }
  ]);
  
  const messagesEndRef = useRef(null);

  // Cuộn xuống cuối mỗi khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // Lắng nghe sự thay đổi của messages

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput(''); // Xóa trắng ô nhập liệu ngay lập tức

    // 1. Hiển thị tin nhắn của User
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    
    // 2. Hiển thị trạng thái "Đang gõ..." của Bot
    setMessages(prev => [...prev, { sender: 'bot', text: '...', isTyping: true }]);

    try {
      // 3. Gọi API xuống Backend Node.js
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userText,
          history: [] // Sau này bạn có thể truyền messages vào đây để AI nhớ ngữ cảnh
        })
      });

      const data = await response.json();

      // 4. Cập nhật lại tin nhắn cuối cùng (thay thế dấu "...")
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          sender: 'bot', 
          text: data.success ? data.reply : "Xin lỗi, mình đang gặp chút sự cố xử lý." 
        };
        return newMessages;
      });

    } catch (error) {
      console.error("Lỗi gọi API:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          sender: 'bot', 
          text: "Mất kết nối đến máy chủ. Bạn vui lòng kiểm tra lại Backend nhé!" 
        };
        return newMessages;
      });
    }
  };

  // Hàm xử lý khi click vào nút gợi ý
  const handleSuggestionClick = (text) => {
    setInput(text);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans">
      {/* Nút bật Chatbot (Floating Button) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform transform hover:scale-110"
        >
          <FaRobot size={28} />
        </button>
      )}

      {/* Giao diện Cửa sổ Chat */}
      {isOpen && (
        <div className="w-[360px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[550px] border border-gray-100">
          
          {/* Header */}
          <div className="bg-purple-600 px-4 py-3 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <FaRobot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">AI Trợ lý tìm trọ</h3>
                <p className="text-xs text-purple-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-purple-500 p-1.5 rounded-lg transition-colors">
              <FaTimes size={18} />
            </button>
          </div>

          {/* Khu vực nội dung Chat (Render động từ mảng messages) */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
            
            {messages.map((msg, index) => (
              msg.sender === 'bot' ? (
                // Bong bóng chat của Bot
                <div key={index} className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0 mt-1">
                    <FaRobot size={14} className="text-white" />
                  </div>
                  <div className="max-w-[85%] flex flex-col gap-2">
                    <div className={`bg-gray-200 text-gray-800 p-3 rounded-2xl rounded-tl-none text-sm leading-relaxed ${msg.isTyping ? 'animate-pulse' : ''}`}>
                      {msg.text}
                    </div>
                    
                    {/* Render Carousel nếu AI trả về kèm data phòng trọ (Ví dụ demo UI) */}
                    {msg.rooms && (
                      <div className="flex gap-2 overflow-x-auto pb-2 snap-x scrollbar-hide">
                        {msg.rooms.map((room, rIndex) => (
                          <div key={rIndex} className="min-w-[140px] bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 snap-start relative cursor-pointer hover:shadow-md">
                            <div className="absolute top-1 right-1 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                              {room.price}
                            </div>
                            <img src={room.image} alt="Room" className="w-full h-20 object-cover" />
                            <div className="p-2">
                              <p className="text-xs font-semibold text-gray-800 truncate">{room.title}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Bong bóng chat của User
                <div key={index} className="flex justify-end">
                  <div className="bg-purple-600 text-white p-3 rounded-2xl rounded-tr-none text-sm leading-relaxed max-w-[85%] shadow-sm">
                    {msg.text}
                  </div>
                </div>
              )
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Khu vực Gợi ý (Suggestion Chips) */}
          <div className="bg-white pt-2 px-3 flex gap-2 overflow-x-auto scrollbar-hide border-t border-gray-100 shrink-0">
            <button 
              onClick={() => handleSuggestionClick('Phòng dưới 2 triệu')}
              className="whitespace-nowrap text-xs bg-gray-100 hover:bg-purple-100 hover:text-purple-700 text-gray-600 py-1.5 px-3 rounded-full transition-colors border border-gray-200">
              Phòng dưới 2 triệu
            </button>
            <button 
              onClick={() => handleSuggestionClick('Gần đại học Duy Tân')}
              className="whitespace-nowrap text-xs bg-gray-100 hover:bg-purple-100 hover:text-purple-700 text-gray-600 py-1.5 px-3 rounded-full transition-colors border border-gray-200">
              Gần đại học Duy Tân
            </button>
            <button 
              onClick={() => handleSuggestionClick('Phòng có gác lửng')}
              className="whitespace-nowrap text-xs bg-gray-100 hover:bg-purple-100 hover:text-purple-700 text-gray-600 py-1.5 px-3 rounded-full transition-colors border border-gray-200">
              Phòng có gác lửng
            </button>
          </div>

          {/* Khung nhập liệu (Input Area) */}
          <div className="p-3 bg-white shrink-0">
            <div className="flex items-center bg-gray-100 rounded-full pr-1 pl-4 py-1 border border-gray-200 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-400 transition-all">
              <input
                type="text"
                className="flex-1 bg-transparent text-sm text-gray-700 focus:outline-none h-9"
                placeholder="Nhập yêu cầu của bạn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              >
                <FaPaperPlane size={12} className="ml-[-2px]" />
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;