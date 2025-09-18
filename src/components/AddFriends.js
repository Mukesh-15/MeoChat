import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function AddFriends() {
  const [users, setUsers] = useState([]);
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://meochat-backend.onrender.com/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        });

        const data = await res.json();
        console.log(data); 
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const sendRequest = async (frndId) => {
    try {
      const res = await fetch("https://meochat-backend.onrender.com/users/frndrequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ frndId }),
      });

      const response = await res.json();

      if (response.success) {
        alert("Friend request sent successfully");
      } else {
        alert("Friend request failed");
      }
    } catch (err) {
      console.error("Error sending friend request:", err);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#f9fafb]">
      <Sidebar />

      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Friends</h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email"
            className="w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`https://i.pravatar.cc/150?u=${user._id}`}
                  alt={user.username}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{user.username}</h4>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                onClick={() => sendRequest(user._id)}
              >
                Add Friend
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
