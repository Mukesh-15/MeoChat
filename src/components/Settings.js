import React, { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import { User, Camera, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BottomNav from "./BottomNav";

export default function Settings() {
  const [me, setMe] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    const fetchMe = async () => {
      try {
        const res = await fetch(`${API_URL}/users/me`, { headers: { "auth-token": localStorage.getItem("token") }});
        const data = await res.json();
        setMe(data);
        setUsername(data.username);
      } catch(e) {}
    };
    fetchMe();
  }, [navigate]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const formData = new FormData();
    formData.append("profilePic", file);
    
    try {
      const toastId = toast.loading("Uploading photo...");
      const res = await fetch(`${API_URL}/users/upload-profile`, {
        method: "POST",
        headers: { "auth-token": localStorage.getItem("token") },
        body: formData
      });
      const data = await res.json();
      if(data.success) {
        setMe({...me, profilePic: data.profilePic});
        toast.success("Profile photo updated!", { id: toastId });
      } else {
        toast.error("Failed to upload photo", { id: toastId });
      }
    } catch(err) {
      toast.error("An error occurred");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const toastId = toast.loading("Saving profile...");
      const res = await fetch(`${API_URL}/users/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "auth-token": localStorage.getItem("token") },
        body: JSON.stringify({ username })
      });
      const data = await res.json();
      if(data.success) {
        setMe({...me, username});
        toast.success("Profile saved successfully!", { id: toastId });
      } else {
        toast.error(data.message || "Failed to save profile", { id: toastId });
      }
    } catch(err) {
      toast.error("An error occurred");
    }
  };

  const profileImg = me?.profilePic ? `${API_URL}${me.profilePic}` : null;

  return (
    <div className="flex h-screen w-screen bg-white font-inter overflow-hidden relative">
      <Sidebar user={me} setUserProfilePic={(pic) => setMe({...me, profilePic: pic})} />
      <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-gray-50/50 flex flex-col pb-28 md:pb-10">
        <h2 className="text-[28px] font-bold text-gray-800 mb-8">Settings</h2>
        
        <div className="max-w-xl bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="flex items-center space-x-6 mb-10">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
              {profileImg ? (
                 <img src={profileImg} alt="" className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-white transition-all group-hover:brightness-90" />
              ) : (
                 <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center text-gray-400 group-hover:brightness-95 transition-all"><User size={40}/></div>
              )}
              <button 
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#448BFF] rounded-full text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors border-2 border-white"
              >
                <Camera size={14} />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{me?.username}</h3>
              <p className="text-gray-500 text-sm">{me?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-100 rounded-xl focus:outline-none focus:border-[#448BFF] transition-colors text-gray-800 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address (Read Only)</label>
              <input 
                type="text" 
                value={me?.email || ""}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-100 rounded-xl text-gray-500 font-medium cursor-not-allowed"
              />
            </div>
            
            <button type="submit" className="w-full bg-[#448BFF] text-white font-bold py-3.5 rounded-xl shadow-[0_4px_15px_rgba(68,139,255,0.4)] hover:bg-blue-600 transition-colors flex items-center justify-center">
              <Save size={18} className="mr-2" /> Save Changes
            </button>
          </form>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
