import bcryptjs from "bcryptjs";
import userModel from "../models/user.model.js";
import generateToken from "../utils/generateToken,js";

export const RegisterController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validate input field
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Please provide all the fields",
      });
    }

    // Alreday email exist
    const emailAlreadyExist = await userModel.findOne({ email });
    if (emailAlreadyExist) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Email already exist with this email address",
      });
    }

    // Hashing password
    const hashedPasswod = await bcryptjs.hash(password, 10);

    // random avatart api
    const avatar = `https://api.dicebear.com/9.x/avataaars/svg?seed={name}`;

    // Create user and save
    const user = new userModel({
      name,
      email,
      password: hashedPasswod,
      avatar,
    });
    await user.save();

    // Generate token
    const token = await generateToken(user._id);

    // Success Response
    return res.status(201).json({
      success: true,
      error: false,
      message: "User registered successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.log(`Errror in Register Controller ${error?.message || error}`);
    return res.status(500).json({
      success: false,
      error: true,
      message: `${error?.message || error} || Internal server error`,
    });
  }
};

export const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate input field
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Please provide both the email and password",
      });
    }

    // Alreday email exist
    const user = await userModel.find({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const comparePassword = await bcryptjs.compare(user.password, password);

    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = await generateToken(user._id);

    // Success Response
    return res.status(201).json({
      success: true,
      error: false,
      message: "User login successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.log(`Errror in Login Controller ${error?.message || error}`);
    return res.status(500).json({
      success: false,
      error: true,
      message: `${error?.message || error} || Internal server error`,
    });
  }
};

export const LogoutController = async (req, res) => {
  try {
  } catch (error) {}
};
