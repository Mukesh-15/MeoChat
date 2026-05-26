import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { MessageCircle, UserPlus, Bell, Settings } from "lucide-react";

export default function BottomNav() {
  const location = useLocation();
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-gray-100 z-50 rounded-t-[30px] px-6 py-4 flex justify-between items-center">
       <NavItem icon={<MessageCircle size={22} />} to="/" active={location.pathname === "/"} />
       <NavItem icon={<UserPlus size={22} />} to="/contact" active={location.pathname === "/contact" || location.pathname === "/addFriends"} />
       <NavItem icon={<Bell size={22} />} to="/notifications" active={location.pathname === "/notifications"} />
       <NavItem icon={<Settings size={22} />} to="/settings" active={location.pathname === "/settings"} />
    </div>
  );
}

const NavItem = ({ icon, to, active }) => {
  if (active) {
    return (
      <div className="relative flex flex-col items-center justify-center w-14 h-14">
        <div className="absolute -top-8 w-[60px] h-[60px] bg-[#448BFF] rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(68,139,255,0.4)] border-4 border-white transition-all">
          {icon}
        </div>
      </div>
    );
  }

  return (
    <Link to={to} className="w-14 h-14 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
      {icon}
    </Link>
  );
};
