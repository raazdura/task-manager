import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import ErrorResponse from '../utils/errorResponse';

// Extend the Request interface
interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  // Check if the Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Extract the token
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify and decode the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    // Find the user by the decoded ID
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse('User not found with this id', 404));
    }

    // Attach the user to the request object
    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};
