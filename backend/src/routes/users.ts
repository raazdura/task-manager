import express, { Request, Response, NextFunction } from 'express';
import { register, login, forgotpassword, resetpassword, getUserDetails, updateUser,getUserTasks } from '../controllers/users';
import multer from 'multer';

const router = express.Router();

const upload = multer();

// Define route handlers with types for request and response
router.route("/register").post(upload.none(), register);
router.route("/login").post(upload.none(), login);

router.route("/userdetails/:id").get(getUserDetails);
router.patch('/update/:id', upload.none(), updateUser);
router.get('/user/:userId/tasks', getUserTasks);

router.patch('/forgotpassword', forgotpassword);
router.route("/resetpassword/:resetToken").post(resetpassword);

export default router;
