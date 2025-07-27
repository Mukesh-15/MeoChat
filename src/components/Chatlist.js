
const ChatList = ({ users, setCurrFrnd }) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200">
      <div className="p-4">
        <input
          className="w-full px-4 py-2 rounded bg-gray-100 focus:outline-none"
          placeholder="Search..."
        />
      </div>
      <div>
        {users.map((user, idx) => (
          <div
            key={idx}
            className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer"
            onClick={() => setCurrFrnd(user.friendId)} 
          >
            <img
              className="w-10 h-10 rounded-full mr-3"
              src={`https://i.pravatar.cc/150?img=${idx + 10}`}
              alt=""
            />
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-medium">{user.username}</span>
                <span className="text-sm text-gray-500">{user.time}</span>
              </div>
              <div className="text-sm text-gray-500 truncate">
                {user.message}
              </div>
            </div>
            {user.unread && (
              <div className="ml-2 w-2 h-2 rounded-full bg-blue-500"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


export default ChatList;
