import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Signup a new user
export const signup = async (req, res) => {
  const { email, fullName, password, profilePic, bio } = req.body;
  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
      profilePic,
      bio,
    });
    // Save user to database
    await newUser.save();

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      message: "User created successfully",
      userData: newUser,
      token,
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = generateToken(userData._id); // Fixed

    res.json({
      success: true,
      message: "User logged in successfully",
      userData,
      token,
    });
    
  } catch (error) {
    console.error("Error during login:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// controller to check if user is authenticated
export const checkAuth = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

// controller to update user profile
export const updateProfile = async (req, res) => {
  const { fullName, profilePic, bio } = req.body;
  try {
    if (!fullName || !bio ||!fullName) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }
    const userId = req.user._id;

    // Update user profile
    let updatedUser;

    if(!profilePic){
      updatedUser=await User.findByIdAndUpdate(
        userId,
        { fullName, bio },
        { new: true }
      );
    }
    else{
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullName, bio, profilePic: upload.secure_url },
        { new: true }
      );
    }

    if (!updatedUser) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
    
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
}