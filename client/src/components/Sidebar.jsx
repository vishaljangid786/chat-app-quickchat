import assets from "../assets//assets.js";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/ChatContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useEffect,useState,useContext } from "react";

const Sidebar = () => {
  const {
    setSelectedUser,
    getUsers,
    users,
    selectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);

  const navigate = useNavigate();
  const [input, setinput] = useState(false);

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}>
      <div className="pb-5">
        <div className="flex items-center justify-between">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative py-5 group">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="cursor-pointer max-h-5"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600  text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="text-sm cursor-pointer">
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p className="text-sm cursor-pointer" onClick={() => logout()}>
                Logout
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            type="text"
            onChange={(e) => setinput(e.target.value)}
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User...."
          />
        </div>
      </div>
      <div className="flex flex-col">
        {filteredUsers.map((user, index) => (
          <div
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
              selectedUser?._id === user._id && "bg-[#282142]/50"
            }`}
            key={index}
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}>
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt="profile image"
              className="w-[35px] aspect-[1/1] rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p>{user?.fullName}</p>
              {onlineUsers.includes(user._id) ? (
                <span className="text-xs text-green-500">Online</span>
              ) : (
                <span className="text-xs text-neutral-400">Offline</span>
              )}
            </div>
            {unseenMessages[user._id] > 0 && (
              <p className="absolute flex items-center justify-center w-5 h-5 text-xs rounded-full top-4 right-4 bg-violet-500/50 ">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
