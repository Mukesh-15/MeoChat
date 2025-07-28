import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ChatList from "./Chatlist";
import ChatBox from "./Chatbox";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
const socket = io.connect("https://meochat-backend.onrender.com");

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);
  const [currFrnd, setCurrFrnd] = useState("");
  const [users, setUsers] = useState([]);
  const [frndName,setFrndName] = useState("Meo Chat");
  useEffect(() => {
    const fetchAllMsgs = async () => {
      try {
        const res = await fetch("https://meochat-backend.onrender.com/users/getAllMsgs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        });

        const data = await res.json();
        setUsers(data);
        setCurrFrnd(data[0].friendId);
        setFrndName(data[0].username);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchAllMsgs();
  }, []);

  return (
    <div className="flex h-screen bg-blue-100">
      <Sidebar />
      <ChatList users={users} setCurrFrnd={setCurrFrnd} />
      <div className="flex flex-col flex-1">
        <ChatBox currFrnd={currFrnd} socket={socket}  frndName={frndName}/>
      </div>
    </div>
  );
}
