import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import {io,userSocketMap} from '../server.js'

// get all users except logged in user
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password -__v"
    );

    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);
    res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.error("Error fetching users for sidebar:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// get all messages for selected User
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// api to mark messages as seen using messageId
export const markMessagesAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedMessage = await Message.findByIdAndUpdate(id, { seen: true });

    if (!updatedMessage) {
      return res.json({ success: false, message: "Message not found" });
    }

    res.json({ success: true, message: "Message marked as seen" });
  } catch (error) {
    console.error("Error marking message as seen:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// api to send message
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Assuming image is a base64 string
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // Emit the new message to the receiver
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    await newMessage.save();

    res.json({ success: true, message: "Message sent successfully" , newMessage });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.json({ success: false, message: error.message });
  }
};
