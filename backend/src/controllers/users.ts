import mongoose from "mongoose";
import crypto from "crypto";
import User from "../models/user";
import ErrorResponse from "../utils/errorResponse";
import sendEmail from "../utils/sendEmail";
import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { RequestHandler } from "express";
import Task from "../models/task";

// Types for the request and response
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

// Validation for Register
const validateRegister = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Provide a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

// Register User
type RegisterRequestBody = {
  username: string;
  email: string;
  password: string;
};

const register: RequestHandler<any, any, RegisterRequestBody> = async (req, res, next) => {

  const { username, email, password } = req.body;
  console.log(username);
  console.log(email);
  console.log(password);

  try {
    // Create the user
    const user = await User.create({ username, email, password });

    // Send the token using a utility function
    sendToken(user, 201, res); // `sendToken` sends the response directly
  } catch (error) {
    // Pass the error to the next middleware
    console.log(error);
    next(new ErrorResponse("User registration failed", 500));
  }
};

// Login User
const login = async (req: LoginRequest, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    // Find the user by email, select password and _id, and populate tasks
    const user = await User.findOne({ email }).select("+password +_id")
      .populate('tasks'); // This will populate the `tasks` field with full task documents

    if (!user || !(await user.matchPassword(password))) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    // Send the user data along with the populated tasks
    sendToken(user, 200, res);
  } catch (error) {
    next(new ErrorResponse("Error during login", 500));
  }
};

// Get User Details
const getUserDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  console.log("ID received:", id);

  // Check if the provided ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid ObjectId:", id); // Add log for invalid ObjectId
    return next(new ErrorResponse("Invalid User ID", 404));
  }

  try {
    // Try to find the user in the database by ID
    const userDetails = await User.findById(id);

    // If no user is found, return an error
    if (!userDetails) {
      console.error("User not found for ID:", id); // Add log for missing user
      return next(new ErrorResponse("User not found", 404));
    }

    // Return the found user details
    res.status(200).json(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error); // Add log for errors
    next(new ErrorResponse("Error fetching user details", 500));
  }
};

const getUserTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params; // Get userId from route parameters
    const { offset = '0', limit = '10', filter = 'all' } = req.query; // Default offset to 0, limit to 10, filter to "all"

    // Validate if userId is provided
    if (!userId) {
      return next(new ErrorResponse('User ID is required', 400));
    }

    // Convert offset and limit to integers
    const skip = parseInt(offset as string, 10);
    const pageLimit = parseInt(limit as string, 10);

    // Fetch the user and ensure the user exists
    const user = await User.findById(userId).select('tasks');
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Define query and sort options based on the filter
    let taskQuery: Record<string, any> = { _id: { $in: user.tasks } }; // Filter only tasks belonging to this user
    let sortOptions: Record<string, 1 | -1> = { createdAt: -1 }; // Default sorting by latest timestamp

    if (filter === 'completed') {
      taskQuery = { ...taskQuery, status: 'completed' }; // Filter by completed tasks
    } else if (filter === 'all') {
      sortOptions = { deadline: 1 }; // Sort by nearest deadline
    } else if (filter === 'deadline') {
      // Exclude completed tasks for "on due" filter and sort by nearest deadline
      taskQuery = { ...taskQuery, status: 'pending' }; // Exclude completed tasks
      sortOptions = { deadline: 1 }; // Sort by nearest deadline
    }

    // Log the final query and sort options for debugging
    console.log('Task Query:', taskQuery);
    console.log('Sort Options:', sortOptions);

    // Fetch the tasks based on filter, pagination, and sorting
    let tasks = await Task.find(taskQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageLimit);

    // Log the tasks retrieved for debugging
    console.log('Fetched Tasks:', tasks);

    // Get the total count of tasks for this filter
    const totalTasks = await Task.countDocuments(taskQuery);

    // Return the filtered and paginated tasks
    res.status(200).json({
      success: true,
      tasks, // Filtered and paginated tasks
      totalTasks, // Total number of tasks matching the filter
      offset: skip,
      limit: pageLimit,
    });
  } catch (error: any) {
    console.error(error);
    next(new ErrorResponse('Error fetching user tasks', 500));
  }
};



// Forgot Password
const forgotpassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("Email not found", 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;
    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password:</p>
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
    next(new ErrorResponse("Error processing password reset request", 500));
  }
};

// Reset Password
const resetpassword = async (req: ResetPasswordRequest, res: Response, next: NextFunction): Promise<void> => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid or expired reset token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, data: "Password Reset Successful" });
  } catch (error) {
    next(new ErrorResponse("Error resetting password", 500));
  }
};

// Update User
const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    if (name) {
      user.username = name;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    next(new ErrorResponse("Error updating user", 500));
  }
};

// Send Token
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
  getUserTasks,
  validateRegister,
};
