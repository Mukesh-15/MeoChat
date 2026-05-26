import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Bell, Check, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import BottomNav from "./BottomNav";

export default function Notifications() {
  const [requests, setRequests] = useState([]);
  const [me, setMe] = useState(null);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    const init = async () => {
      try {
        const res = await fetch(`${API_URL}/users/me`, { headers: { "auth-token": localStorage.getItem("token") }});
        setMe(await res.json());
      } catch(e) {}
      
      try {
        const res = await fetch(`${API_URL}/users/pending-requests`, { headers: { "auth-token": localStorage.getItem("token") } });
        setRequests(await res.json());
      } catch (err) {}
    };
    init();
  }, [navigate]);

  const handleRequest = async (reqId, action) => {
    try {
      const endpoint = action === 'accept' ? 'accept-request' : 'reject-request';
      const res = await fetch(`${API_URL}/users/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": localStorage.getItem("token") },
        body: JSON.stringify({ requestId: reqId }),
      });
      const response = await res.json();
      if(response.success) {
        setRequests(prev => prev.filter(r => r._id !== reqId));
        toast.success(`Friend request ${action}ed`);
      } else {
        toast.error(response.message);
      }
    } catch(err) {
      toast.error("Failed to process request");
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white font-inter overflow-hidden relative">
      <Sidebar user={me} setUserProfilePic={(pic) => setMe({...me, profilePic: pic})} />
      <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-gray-50/50 pb-28 md:pb-10">
        <h2 className="text-[28px] font-bold text-gray-800 mb-8">Notifications</h2>
        
        {requests.length === 0 ? (
           <div className="text-gray-500 flex flex-col items-center justify-center h-[50vh]">
             <Bell className="w-16 h-16 text-gray-300 mb-4" />
             <p>No new friend requests</p>
           </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {requests.map(req => {
              const profileImg = req.from.profilePic ? `${API_URL}${req.from.profilePic}` : null;
              return (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={req._id} className="bg-white p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    {profileImg ? (
                       <img src={profileImg} alt="" className="w-14 h-14 rounded-full object-cover shadow-sm" />
                    ) : (
                       <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400"><User size={24}/></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 truncate">{req.from.username}</h4>
                      <p className="text-[12px] text-gray-500 truncate">{req.from.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-auto">
                    <button onClick={() => handleRequest(req._id, 'accept')} className="flex-1 bg-[#448BFF] hover:bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center shadow-md transition-colors">
                      <Check size={18} className="mr-1" /> Accept
                    </button>
                    <button onClick={() => handleRequest(req._id, 'reject')} className="flex-1 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 py-2 rounded-xl text-sm font-semibold flex items-center justify-center transition-colors">
                      <X size={18} className="mr-1" /> Reject
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
