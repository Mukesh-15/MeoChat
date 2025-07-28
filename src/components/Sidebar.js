import { Link } from "react-router-dom";

const Sidebar = (props) => {
  return (
    <div className="w-20 bg-white flex flex-col items-center py-6">
      <div className="mb-6">
        <img className="rounded-full w-10 h-10" src={`https://i.pravatar.cc/150?u=${props.id}`} alt="avatar" />
      </div>
      <div className="flex flex-col space-y-6 text-gray-600 text-xl">
        <Link to="/"><ion-icon name="chatbubble-ellipses-outline"></ion-icon></Link>
        <Link to="/addFriends"><ion-icon name="person-add-outline"></ion-icon></Link>
        <ion-icon name="calendar-outline"></ion-icon>
        <ion-icon name="settings-outline"></ion-icon>
      </div>
    </div>
  );
};

export default Sidebar;
