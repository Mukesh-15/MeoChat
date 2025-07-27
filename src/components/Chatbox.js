import { useEffect, useState } from "react";

const ChatBox = ({ currFrnd, socket }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/users/messages/${currFrnd}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
          }
        );

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

    if (currFrnd) {
      fetchChatHistory();
    }
  }, [currFrnd, socket]);

  useEffect(() => {
    const handleIncomingMsg = (data) => {
      setChatHistory((prev) => [...prev, data]);
    };

    if (roomId) {
      socket.on("send-message", handleIncomingMsg);
    }

    return () => {
      socket.off("send-message", handleIncomingMsg);
    };
  }, [roomId, socket]);

  const onChange = (e) => setMsg(e.target.value);

  const handleClick = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/users/sendMsg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          to: currFrnd,
          content: msg,
        }),
      });

      const data = await res.json();
      // setChatHistory((prev) => [...prev, data.data]);
      setMsg("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <div>
          <h2 className="font-semibold text-gray-800">Meo Chat</h2>
          <p className="text-sm text-gray-400">32 members, 6 online</p>
        </div>
        <div className="flex space-x-4 text-xl text-gray-500">
          <ion-icon name="call-outline"></ion-icon>
          <ion-icon name="videocam-outline"></ion-icon>
          <ion-icon name="search-outline"></ion-icon>
          <ion-icon name="ellipsis-horizontal-outline"></ion-icon>
        </div>
      </div>

      <div className="flex-1 px-6 py-4 overflow-y-auto space-y-4 bg-gray-50">
        {chatHistory.map((chat, idx) =>
          chat.from === userId ? (
            <div key={idx} className="flex flex-col items-end">
              <div className="bg-blue-500 text-white p-3 rounded">
                <p>{chat.content}</p>
              </div>
              <span className="text-xs text-gray-400 mt-1">
                {new Date(chat.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ) : (
            <div key={idx} className="flex flex-col items-start">
              <div className="bg-white p-3 rounded shadow">
                <p>{chat.content}</p>
              </div>
              <span className="text-xs text-gray-400 mt-1">
                {new Date(chat.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )
        )}
      </div>

      <form
        className="px-4 py-3 border-t bg-white flex items-center space-x-4"
        onSubmit={handleClick}
      >
        <ion-icon name="happy-outline" className="text-2xl text-gray-500" />
        <input
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none"
          placeholder="Your message"
          value={msg}
          onChange={onChange}
        />
        <button type="submit">
          <ion-icon
            name="send"
            className="text-blue-500 text-2xl cursor-pointer"
          />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
