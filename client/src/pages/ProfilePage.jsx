import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

const ProfilePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState("Martin Johnson");
  const [bio, setBio] = useState("Hi everyone i'm using quickchat.");

  const handleSubmit = async(e) => {
    e.preventDefault();
    navigate("/");
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-no-repeat bg-cover">
      <div className="flex items-center justify-between w-5/6 max-w-2xl text-gray-300 border-2 border-gray-600 rounded-lg backdrop-blur-2xl max-sm:flex-col-reverse ">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 gap-5 p-10">
          <h3 className="text-lg">Profile Details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer">
            <input
              onChange={(e) => setSelectedImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
            />
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : assets.avatar_icon
              }
              className={`w-12 h-12 ${selectedImage && "rounded-full"}`}
            />
            upload profile image
          </label>

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your Name"
            required
            className="p-2 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            required
            placeholder="Write Profile bio"
            className="p-2 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={4}></textarea>

          <button
            type="submit"
            className="p-2 text-lg text-white rounded-full cursor-pointer bg-gradient-to-r from-purple-400 to-violet-600">
            Save
          </button>
        </form>
        <img
          src={assets.logo_icon}
          className="mx-10 rounded-full max-w-44 aspect-square max-sm:mt-10"
          alt=""
        />
      </div>
    </div>
  );
};

export default ProfilePage;
