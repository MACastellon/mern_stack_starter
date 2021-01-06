import express from 'express';
import {userRegister,userConfirmation,userLogin, verifyToken,forgotPassword, forgotPasswordVerify, forgotPasswordReset, resetPassword} from "../controllers/users.controller.js";


const router = express.Router();

//Register route
router.post('/register', userRegister);
//Email confirmation route
router.post('/confirmation/:token', userConfirmation);
//Login route
router.post('/login', userLogin);
//Verify Token route
router.post('/verify', verifyToken);
//Forgot Password route
router.post('/forgot_password', forgotPassword);

// Forgot Password Reset  route
router.put('/forgot_password/reset', forgotPasswordReset);
// Forgot Password Verify Token route
router.post('/forgot_password/:token', forgotPasswordVerify);

// Reset Password
router.put("/reset_password", resetPassword);


export default router;