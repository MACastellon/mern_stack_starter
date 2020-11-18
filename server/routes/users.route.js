import express from 'express';
import {userRegister,userConfirmation,userLogin, verifyToken} from "../controllers/users.controller.js";

const router = express.Router();
router.get("/", function(req,res) {
    return res.json("alloo")
})
//Register route
router.post('/register', userRegister);
//Email confirmation route
router.post('/confirmation/:token', userConfirmation);
//Login route
router.post('/login', userLogin);
//Verify Token route
router.post('/verify', verifyToken);

export default router;