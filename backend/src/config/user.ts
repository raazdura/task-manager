import mongoose from "mongoose";
import crypto from "crypto";
import User from "../models/user";
import ErrorResponse from '../utils/errorResponse';
import sendEmail from '../utils/sendEmail';
import multer from "multer";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";

// Types for the request and response
interface RegisterRequest extends Request {
  body: {
    username: string;
    email: string;
    password: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

interface ResetPasswordRequest extends Request {
  params: {
    resetToken: string;
  };
  body: {
    password: string;
  };
}

const register = async (req: RegisterRequest, res: Response, next: NextFunction): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
    });

    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

const login = async (req: LoginRequest, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    const user = await User.findOne({ email }).select("+password +_id");

    if (!user) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    sendToken(user, 201, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getUserDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }

  try {
    const userDetails = await User.findById(id)
      .populate({
        path: 'playlists',
        model: 'Playlist',
        populate: {
          path: 'tracks',
          model: 'Song',
        },
      })
      .populate({
        path: 'albums',
        model: 'Album',
      })
      .populate({
        path: 'followings',
        model: 'Artist',
      })
      .populate({
        path: 'tracks',
        model: 'Song',
      });

    if (!userDetails) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(userDetails);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "An error occurred while fetching the user details" });
  }
};

const forgotpassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("Email could not be sent", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (error) {
    next(error);
  }
};

const resetpassword = async (req: ResetPasswordRequest, res: Response, next: NextFunction): Promise<void> => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "Password Reset Success",
    });
  } catch (error) {
    next(error);
  }
};

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/users"); // Define where to store the images (ensure this folder exists)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Create unique filename
  },
});
const upload = multer({ storage: storage });

const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;
  const photo = req.file ? req.file.path.replace(/\\/g, "/") : null;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If there's a new image, delete the old one from the server
    if (photo && user.photo) {
      const oldPhotoPath = path.join(__dirname, "..", "uploads", user.photo);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath); // Delete the old image file
      }
    }

    if (name) {
      user.username = name || user.username;
    }

    if (photo) {
      user.photo = photo; // Update image if a new one is uploaded
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const sendToken = (user: any, statusCode: number, res: Response): void => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, user, token });
};

export {
  register,
  login,
  forgotpassword,
  resetpassword,
  getUserDetails,
  updateUser,
  upload,
};
