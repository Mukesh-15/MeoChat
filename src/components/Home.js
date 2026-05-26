import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ChatList from "./Chatlist";
import ChatBox from "./Chatbox";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import BottomNav from "./BottomNav";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const socket = io.connect(API_URL);

export default function Home() {
  const navigate = useNavigate();

  const [currFrnd, setCurrFrnd] = useState("");
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [frndName, setFrndName] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    const init = async () => {
      try {
        const myRes = await fetch(`${API_URL}/users/me`, {
          headers: { "auth-token": localStorage.getItem("token") }
        });
        const myData = await myRes.json();
        setMe(myData);
        socket.emit("user-connected", myData._id);
      } catch(e) {}

      try {
        const res = await fetch(`${API_URL}/users/getAllMsgs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        });
        const data = await res.json();
        if (data && data.length > 0 && !data.error) {
           setUsers(data);
           setCurrFrnd(data[0].friendId);
           setFrndName(data[0].username);
        }
      } catch (err) {}
    };

    init();

    socket.on("user-status-changed", ({ userId, isOnline }) => {
      setUsers(prev => prev.map(u => u.friendId === userId ? { ...u, isOnline } : u));
    });

    return () => {
      socket.off("user-status-changed");
    };
  }, [navigate]);

  const activeFriendData = users.find(u => u.friendId === currFrnd);

  return (
    <div className="flex h-screen w-screen bg-white font-inter overflow-hidden relative">
      <Sidebar user={me} setUserProfilePic={(pic) => setMe({...me, profilePic: pic})} />
      
      <div className={`h-full shrink-0 border-r border-gray-100 z-10 w-full md:w-[380px] lg:w-[420px] ${currFrnd ? 'hidden md:block' : 'block'}`}>
         <ChatList users={users} setCurrFrnd={setCurrFrnd} setFrndName={setFrndName} currFrnd={currFrnd} />
      </div>
      
      <div className={`flex-1 h-full bg-white relative ${currFrnd ? 'block' : 'hidden md:block'}`}>
        <AnimatePresence mode="wait">
          {currFrnd ? (
            <ChatBox 
              key={currFrnd} 
              currFrnd={currFrnd} 
              setCurrFrnd={setCurrFrnd}
              socket={socket} 
              frndName={frndName} 
              friendUser={activeFriendData} 
            />
          ) : (
            <div className="flex flex-col h-full items-center justify-center text-gray-400 bg-white">
               <div className="w-24 h-24 mb-6 rounded-full bg-blue-50 flex items-center justify-center shadow-inner">
                  <span className="text-4xl">💬</span>
               </div>
               <h2 className="text-2xl font-bold text-gray-500">No chat selected</h2>
            </div>
          )}
        </AnimatePresence>
      </div>

      {!currFrnd && <BottomNav />}
    </div>
  );
}
