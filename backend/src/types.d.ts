import { IUser } from "./models/user"; // Adjust the path as needed

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Add the user property
    }
  }
}