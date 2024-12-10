import crypto from "crypto";
import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Define an interface for the User document
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  tasks: string[]; 
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;

  matchPassword(password: string): Promise<boolean>;
  getSignedToken(): string;
  getResetPasswordToken(): Promise<string>;
}

// Define the schema
const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "Please provide username"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false, // Exclude password from query results by default
  },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
},
{ timestamps: true });

// Pre-save middleware to hash the password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: Match password
UserSchema.methods.matchPassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Instance method: Generate signed JWT
UserSchema.methods.getSignedToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET || "8124d6efd18d07788385eb5ac3d94d4cdfa9ba619c2c7f63b091eab6e9f8efe6d22674", {
    expiresIn: process.env.JWT_EXPIRE || "10min",
  });
};

// Instance method: Generate and hash reset password token
UserSchema.methods.getResetPasswordToken = async function (): Promise<string> {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return resetToken;
};

// Create the User model
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
