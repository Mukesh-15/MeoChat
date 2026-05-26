import { useEffect, useState, useRef } from "react";
import { Smile, Send, User, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ChatBox = ({ currFrnd, setCurrFrnd, socket, frndName, friendUser }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef(null);
  
  const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/users/messages/${currFrnd}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        });
        const data = await res.json();
        setChatHistory(data.messages);
        setUserId(data.yourId);
        const room = [data.yourId, currFrnd].sort().join("_");
        setRoomId(room);
        socket.emit("join-room", room);
      } catch (err) {
        console.error("Error fetching chat history:", err);
      }
    };
    if (currFrnd) fetchChatHistory();
  }, [currFrnd, socket, API_URL]);

  useEffect(() => scrollToBottom(), [chatHistory]);

  useEffect(() => {
    const handleIncomingMsg = (data) => setChatHistory((prev) => [...prev, data]);
    if (roomId) socket.on("send-message", handleIncomingMsg);
    return () => socket.off("send-message", handleIncomingMsg);
  }, [roomId, socket]);

  const onChange = (e) => setMsg(e.target.value);

  const handleClick = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    try {
      await fetch(`${API_URL}/users/sendMsg`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ to: currFrnd, content: msg }),
      });
      setMsg("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const formatStatus = () => {
    if(!friendUser) return "offline";
    if(friendUser.isOnline) return "Online now";
    if(friendUser.lastOnline) {
       const diff = Math.floor((Date.now() - new Date(friendUser.lastOnline).getTime()) / (1000 * 60 * 60));
       return diff > 0 ? `last online ${diff} hours ago` : "last online recently";
    }
    return "offline";
  };

  const profileImg = friendUser?.profilePic ? `${API_URL}${friendUser.profilePic}` : null;

  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      {/* Header */}
      <div className="flex justify-between items-center px-4 md:px-10 py-6 border-b border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] bg-white z-10 shrink-0">
        <div className="flex items-center space-x-4">
          <button onClick={() => setCurrFrnd("")} className="md:hidden text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeft size={24} />
          </button>
          {profileImg ? (
             <img src={profileImg} alt="Friend" className="w-[45px] h-[45px] rounded-full object-cover shadow-sm" />
          ) : (
             <div className="w-[45px] h-[45px] rounded-full bg-gray-100 flex items-center justify-center text-gray-400"><User size={24}/></div>
          )}
          <div>
            <h2 className="font-bold text-[18px] text-gray-800">{frndName}</h2>
            <p className="text-[13px] font-medium text-[#448BFF]">{formatStatus()}</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-10 py-8 bg-white scrollbar-hide">
        <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
          {chatHistory.map((chat, idx) => {
            const isMe = chat.from === userId;
            const prevChat = chatHistory[idx - 1];
            const showAvatar = !prevChat || prevChat.from !== chat.from;
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx} 
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                {!isMe && (
                  <div className="w-10 mr-4 shrink-0 mt-1">
                    {showAvatar && (
                       profileImg ? 
                         <img src={profileImg} className="w-8 h-8 rounded-full shadow-sm object-cover" alt="" /> :
                         <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400"><User size={16}/></div>
                    )}
                  </div>
                )}
                
                <div className={`flex flex-col max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
                  <div className={`px-6 py-4 shadow-[0_4px_15px_rgba(0,0,0,0.05)] text-[15px] leading-relaxed ${
                    isMe 
                      ? "bg-[#448BFF] text-white rounded-[20px] rounded-tr-[4px]" 
                      : "bg-white border border-gray-100 text-gray-700 rounded-[20px] rounded-tl-[4px]"
                  }`}>
                    {chat.content}
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="p-6 bg-white border-t border-gray-50">
        <form className="flex items-center w-full max-w-4xl mx-auto" onSubmit={handleClick}>
          <div className="flex-1 mr-4 flex items-center bg-[#F8FAFC] rounded-full px-6 py-[14px] shadow-sm border border-gray-100">
            <input
              className="flex-1 bg-transparent focus:outline-none text-[15px] text-gray-700 placeholder-gray-400"
              placeholder="Type a message here"
              value={msg}
              onChange={onChange}
            />
            <button type="button" className="text-gray-400 hover:text-gray-600 ml-3">
              <Smile size={22} />
            </button>
          </div>
          
          <button type="submit" className="w-[46px] h-[46px] flex items-center justify-center bg-[#448BFF] text-white rounded-full shadow-[0_4px_15px_rgba(68,139,255,0.4)] hover:bg-blue-600 transition-colors shrink-0">
            <Send size={18} className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
