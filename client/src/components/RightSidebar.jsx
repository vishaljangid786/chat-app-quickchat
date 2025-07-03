import React, { useContext,useState,useEffect } from "react";
import assets, { imagesDummyData } from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import {ChatContext } from '../../context/ChatContext'

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  // get all images from messages
  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, []);

  return (
    selectedUser && (
      <div
        className={`bg-[#8185B2]/10 text-white w-full  relative overflow-y-scroll ${
          selectedUser ? "max-lg:hidden" : ""
        }`}>
        <div className="flex flex-col items-center gap-2 pt-16 mx-auto text-xs font-light">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            className="w-20 aspect-[1/1] rounded-full"
            alt="profile pic"
          />
          <h1 className="flex items-center gap-2 px-10 mx-auto text-xl font-medium">
            {onlineUsers.includes(selectedUser._id) && (
              <p className="w-2 h-2 bg-green-500 rounded-full"></p>
            )}
            {selectedUser.fullName}
          </h1>
          <p className="px-10 mx-auto">{selectedUser.bio}</p>
        </div>

        <hr className="border-[#ffffff50] my-4" />

        <div className="px-5 text-xs">
          <p>Media</p>
          <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
            {msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="rounded cursor-pointer">
                <img src={url} className="h-full rounded-md" alt="" />
              </div>
            ))}
          </div>
        </div>

        <button onClick={()=>logout()} className="absolute px-20 py-2 text-sm font-light text-white transform -translate-x-1/2 border-none rounded-full cursor-pointer bottom-5 left-1/2 bg-gradient-to-r from-purple-400 to-violet-600">
          Logout
        </button>
      </div>
    )
  );
};

export default RightSidebar;
