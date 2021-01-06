import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : `${process.env.USER_EMAIL}`,
        pass : `${process.env.USER_PASSWORD}`
    }
})



/*
* Basic function section
 */

const verifyEmail = (email) => {

    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
        return true;
    }
    return false;
}


const verifyForgotPasswordToken = async (token) => {
    try {
        const decodedToken =  await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const email = decodedToken.email;
        const user = await User.findOne({email : email});

        const isValidToken = await bcrypt.compare(`${user._id}`, user.reset_token);

        if (isValidToken) {
            return true;
        } else {
            return {success : false};
        }
    }catch (e) {
        if (e.expiredAt) return {message : 'You took too long to reset your password', success: false, expired : true}
        if (e.message) return {message : 'Something went wrongsss', success : false}
    }

}

const extractToken = (data) => {
    const tokenArray = data.split(" ");
    return tokenArray[1];
}


/*
* Routes functions
 */
export const userRegister = async (req,res) => {

    const {firstName, lastName, email, password, password2} = req.body;
    let err = [];

    //Form verification before the registration
    if (!firstName || !lastName || !email || !password || !password2) err.push({message : "You must fill all the empty field" });
    if (!verifyEmail(email)) err.push({message : "please enter a valid email" });
    if (password != password2) err.push({message : "Passwords must be identical"});

    if (err.length != 0) return res.json(err);

    //Verify is the email has already been taken
    const user = await  User.findOne({email});

    if (user) return res.json({message: "This email has already been taken", success : false});

    //hash the password
    const hashedPassword =  await bcrypt.hash(password, 10);

    //create the new user model
    const newUser = new User({
        firstName : firstName,
        lastName : lastName,
        email : email,
        password: hashedPassword,
        isVerified: false
    });

    //save the newUser in the database
    await newUser.save();
    // Send email ...
    const token = await jwt.sign({id : newUser._id},process.env.ACCESS_TOKEN_SECRET);
    const msg = {
        to : `${email}`,
        from : 'macastellon101@gmail.com',
        subject : 'Please confirm your email',
        html : `<h1>Welcome to ...</h1>
                <p>click the link below to activate your account and start using the app</p>
                <a href="http://localhost:3000/users/verify/${token}">Click Here<a>
                `
    }

    transporter.sendMail(msg,(err, res)  => {
        if (err) console.log(err)
        console.log(res)
    })

    return res.json({message : "Please verify your email", success : true});


}

export const userConfirmation = async (req,res) => {
    const token = req.params.token;

    try {
        const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        await User.update({_id : user.id}, {$set : {isVerified : true}})
    }catch (e) {
        return res.json({message: "This token is invalid", success: false});
    }

    res.json({message : `Validation complete`, success: true})
}

export const userLogin = async (req,res) => {

    const email = req.body.email;
    const password = req.body.password;

    let err = [];
    console.log(req.headers);
    // Verify if the field are empty
    if (email === "") err.push({message : "the email field is empty"});
    if (password === "") err.push({message : "The password field is empty"});

    if (err.length != 0) return res.json(err)

    // Verify if the account already exist or isVerified
    const user = await User.findOne({email});
    if (!user) return res.json({message : 'This account does not exist'});
    if (!user.isVerified) return res.json({message : 'please verify your email before log in'});

    //Compare password
    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
        // Make object of user data without the password
        const userData = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            info_changed : user.info_changed
        }

        //Create and send the JWT
        const accessToken = await jwt.sign(userData,process.env.ACCESS_TOKEN_SECRET);
        res.json({token : accessToken, success: true });
    } else {
        res.json({message : 'The password is incorrect', success: false })
    }
}

export const verifyToken = async (req,res) => {
    const token = extractToken(req.headers.authorization);
    //Verify if the token is valid
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, async (err,verifiedToken) => {
        if (err) return res.json({err ,success : false})
        if (!verifiedToken) return res.json({success : false});

        const user = await User.findOne({_id : verifiedToken._id});

        // Verify if any change happend since the last token creation;
        if (user.info_changed.getTime() !== new Date(`${verifiedToken.info_changed}`).getTime()) return res.json({success : false});

        return res.json({success : true});
    });
}

export const forgotPassword = async (req,res) => {
    const email = req.body.email;

    // Find the user
    const user = await User.findOne({email : email});
    if (!user) return res.json({message: `This account doesn't exist`, success : false});
    const hashedToken =  await bcrypt.hash(`${user._id}`,10)
    const emailToken = await jwt.sign({reset_token : hashedToken , email : user.email},process.env.ACCESS_TOKEN_SECRET,{expiresIn : '1h'});

   await User.updateOne({email}, {$set : {reset_token : hashedToken}})

    const msg = {
        to : user.email,
        from : 'macastellon101@gmail.com',
        subject : 'Reset your forgotten password now',
        html : `<h1>This mail contain the link to reset your forgotten password</h1>
                <a href="http://localhost:3000/users/forgot_password/reset/${emailToken}">Click Here<a>
                `
    }

    transporter.sendMail(msg,(err, res)  => {
        if (err) console.log(err)
    })

    return res.json({message : 'Check your email to reset your password', success : true});
}

export const forgotPasswordVerify = async (req,res) => {

    const token = req.params.token

    try {
        const decodedToken =  await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        console.log(decodedToken)
        const reset_token = await decodedToken.reset_token;
        const email = decodedToken.email;
        const user = await User.findOne({email : email});

        const isValidToken = await bcrypt.compare(`${user._id}`, user.reset_token);

        if (isValidToken) {
            return res.json({success : true});
        } else {
            return res.json({success : false})
        }
    }catch (e) {
        if (e.expiredAt) return res.json({message : 'You took too long to reset your password', success: false, expired : true})
        if (e.message) return res.json({message : 'Something went wrong', success : false})
    }

}

export const forgotPasswordReset = async (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;
    const token = req.body.token;

    if( password !== password2) return res.json({message : "Passwords must be identical", success: false})

    const isValidToken =  await verifyForgotPasswordToken(token)

    if (isValidToken.expired) return res.json(isValidToken);
    if(isValidToken.message) return res.json(isValidToken);

    const hashedPassword =  await bcrypt.hash(password, 10);
    // Set the new user's password
    await User.updateOne({email}, {$set : {password : hashedPassword, reset_token : null, info_changed: new Date()}})
    

    return  res.json({success : true})
}
export const resetPassword = async (req,res) => {

    const _id = req.body._id;
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const newPassword2 = req.body.newPassword2;
    const user = await User.findOne({_id : _id});
    // Error Verification.
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) return res.json({message : "Your current password is invalid", success: false});
    if (currentPassword === newPassword) return res.json({message : 'You cannot use the current password as your new password.' ,success : false})
    if (newPassword !== newPassword2) return res.json({message: "Your new password doesn't match...", success : false});

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne({_id : _id}, {$set : {password : hashedNewPassword, info_changed : Date.now()}})

    return res.json({success : true});
}
