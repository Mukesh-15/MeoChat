import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Search, UserPlus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import BottomNav from "./BottomNav";

export default function AddFriends() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [me, setMe] = useState(null);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    const fetchMe = async () => {
      try {
        const res = await fetch(`${API_URL}/users/me`, { headers: { "auth-token": localStorage.getItem("token") }});
        setMe(await res.json());
      } catch(e) {}
    };
    fetchMe();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const url = searchQuery ? `${API_URL}/users?search=${encodeURIComponent(searchQuery)}` : `${API_URL}/users`;
      const res = await fetch(url, { headers: { "auth-token": localStorage.getItem("token") } });
      const data = await res.json();
      setUsers(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const sendRequest = async (frndId) => {
    try {
      const res = await fetch(`${API_URL}/users/frndrequest`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": localStorage.getItem("token") },
        body: JSON.stringify({ frndId }),
      });
      const response = await res.json();
      if (response.success) toast.success("Friend request sent!");
      else toast.error(response.message);
    } catch (err) { toast.error("Failed to send request"); }
  };

  return (
    <div className="flex h-screen w-screen bg-white font-inter overflow-hidden relative">
      <Sidebar user={me} setUserProfilePic={(pic) => setMe({...me, profilePic: pic})} />

      <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-gray-50/50 pb-28 md:pb-10">
        <h2 className="text-[28px] font-bold text-gray-800 mb-6 tracking-tight">Find Friends</h2>
        <div className="relative mb-8 max-w-xl">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email"
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:border-[#448BFF] text-[15px]"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map(user => {
            const profileImg = user.profilePic ? `${API_URL}${user.profilePic}` : null;
            return (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={user._id} className="bg-white p-5 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-between group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all">
                <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                  {profileImg ? (
                     <img src={profileImg} alt="" className="w-12 h-12 rounded-full object-cover shadow-sm shrink-0" />
                  ) : (
                     <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0"><User size={20}/></div>
                  )}
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-800 text-[15px] truncate">{user.username}</h4>
                    <p className="text-[12px] text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <button onClick={() => sendRequest(user._id)} className="w-10 h-10 shrink-0 rounded-full bg-[#EBF3FF] text-[#448BFF] flex items-center justify-center group-hover:bg-[#448BFF] group-hover:text-white transition-colors shadow-sm">
                  <UserPlus size={18} />
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
