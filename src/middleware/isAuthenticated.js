import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Unauthorized user. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Invalid token.",
      });
    }
    // Find user
    const user = await userModel.findById(decoded.userID).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Invalid User.",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(`Error in Authentication ${error?.message || error}`);
    return res.status(401).json({
      success: false,
      error: true,
      message: "Unauthorized. Invalid or expired token.",
    });
  }
};

export default isAuthenticated;
