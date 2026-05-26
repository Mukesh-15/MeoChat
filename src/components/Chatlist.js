import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { User } from "lucide-react";

const ChatList = ({ users, setCurrFrnd, setFrndName, currFrnd }) => {
  return (
    <div className="w-full bg-[#F8FAFC] flex flex-col h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[28px] font-bold text-gray-800">Chats</h2>
      </div>

      <div className="flex items-center space-x-3 mb-6 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
        <Search size={18} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Search chats" 
          className="flex-1 outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide pr-1 pb-24 md:pb-4">
        {users.map((user, idx) => {
          const isActive = currFrnd === user.friendId;
          const profileImg = user.profilePic ? `${process.env.REACT_APP_BACKEND_URL}${user.profilePic}` : null;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={idx}
              onClick={() => {
                setCurrFrnd(user.friendId);
                setFrndName(user.username);
              }}
              className={`flex items-start p-4 rounded-xl cursor-pointer transition-all ${
                isActive ? "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-l-[3px] border-[#448BFF]" : "bg-white hover:shadow-sm border border-transparent"
              }`}
            >
              <div className="relative shrink-0">
                {profileImg ? (
                   <img src={profileImg} alt="" className="w-[46px] h-[46px] rounded-full object-cover" />
                ) : (
                   <div className="w-[46px] h-[46px] rounded-full bg-gray-100 flex items-center justify-center text-gray-400"><User size={24}/></div>
                )}
                {user.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-[2px] border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1 ml-4 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-[15px] text-gray-800 truncate">{user.username}</h4>
                  <span className="text-[11px] font-semibold text-gray-400 shrink-0 ml-2">{user.time}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className={`text-[13px] truncate pr-2 ${user.unread ? "text-gray-800 font-semibold" : "text-gray-500"}`}>
                    {user.message}
                  </p>
                  {user.unread && (
                    <div className="w-[18px] h-[18px] shrink-0 bg-[#FF5B5B] rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                      1
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
