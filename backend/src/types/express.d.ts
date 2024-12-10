
import { User } from './models/User'; // Adjust the path as needed

declare global {
  namespace Express {
    interface Request {
      user?: User; 
    }
  }
}
