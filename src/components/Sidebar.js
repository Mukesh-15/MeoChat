import { Link, useLocation } from "react-router-dom";
import { MessageCircle, UserPlus, Bell, Settings, LogOut, User } from "lucide-react";
import { useRef } from "react";
import { motion } from "framer-motion";

const Sidebar = ({ user, setUserProfilePic }) => {
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const formData = new FormData();
    formData.append("profilePic", file);
    
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/upload-profile`, {
        method: "POST",
        headers: { "auth-token": localStorage.getItem("token") },
        body: formData
      });
      const data = await res.json();
      if(data.success) {
        if(setUserProfilePic) setUserProfilePic(data.profilePic);
      }
    } catch(err) {
      console.error(err);
    }
  };

  const getProfileImage = () => {
     if (user?.profilePic) return `${process.env.REACT_APP_BACKEND_URL}${user.profilePic}`;
     return null;
  };

  const profileImg = getProfileImage();

  return (
    <div className="hidden md:flex w-[280px] bg-white flex-col h-full shrink-0 shadow-[2px_0_10px_rgba(0,0,0,0.02)] z-20">
      <div className="flex flex-col items-center pt-10 pb-8 px-6">
        <div 
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        >
          {profileImg ? (
             <img 
               src={profileImg} 
               alt="profile" 
               className="w-[90px] h-[90px] rounded-full object-cover border-4 border-white shadow-md transition-all group-hover:brightness-75"
             />
          ) : (
             <div className="w-[90px] h-[90px] rounded-full border-4 border-white shadow-md flex items-center justify-center bg-gray-100 text-gray-400 group-hover:brightness-95 transition-all cursor-pointer">
                <User size={40} />
             </div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-semibold drop-shadow-md">Upload</span>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
        </div>
        
        <div className="mt-4 flex items-center space-x-1 cursor-pointer">
          <h3 className="font-bold text-gray-800 text-[15px]">{user?.username || "Loading..."}</h3>
        </div>
      </div>

      <div className="flex-1 mt-6">
        <SidebarItem icon={<MessageCircle size={20} />} label="CHAT" to="/" active={location.pathname === "/"} />
        <SidebarItem icon={<UserPlus size={20} />} label="CONTACT" to="/contact" active={location.pathname === "/contact" || location.pathname === "/addFriends"} />
        <SidebarItem icon={<Bell size={20} />} label="NOTIFICATIONS" to="/notifications" active={location.pathname === "/notifications"} />
        <SidebarItem icon={<Settings size={20} />} label="SETTINGS" to="/settings" active={location.pathname === "/settings"} />
      </div>

      <div className="mb-8">
        <SidebarItem icon={<LogOut size={20} />} label="LOG OUT" to="/login" danger />
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, to, active, danger }) => {
  const content = (
    <div className={`relative flex items-center px-8 py-[14px] cursor-pointer transition-colors ${
      active ? "text-blue-500" : danger ? "text-gray-500 hover:text-red-500" : "text-gray-500 hover:text-gray-800"
    }`}>
      {active && (
        <motion.div layoutId="activeTab" className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md" />
      )}
      <div className="flex items-center space-x-4">
        <span className={active ? "text-blue-500" : ""}>{icon}</span>
        <span className={`text-[13px] tracking-wide font-bold uppercase ${active ? "text-blue-500" : ""}`}>{label}</span>
      </div>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
};

export default Sidebar;
