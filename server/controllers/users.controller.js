import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import sendGrid from '@sendgrid/mail';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : '',
        pass : ''
    }
})

dotenv.config();

/*
* Basic function section
 */

const verifyEmail = (email) => {

    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
        return true;
    }
    return false;
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

    if (user) return res.status(409).json({message: "This email has already been taken"});

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
        to : 'marco911@live.ca',
        from : 'macastellon101@gmail.com',
        subject : 'Please confirm your email',
        html : `<h1>Welcome to ...</h1>
                <p>click the link below to activate your account and start using the app</p>
                <a href="http://localhost:5000/users/confirmation/${token}">Click Here<a>
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
            lastName: user.lastName
        }

        //Create and send the JWT
        const accessToken = await jwt.sign(userData,process.env.ACCESS_TOKEN_SECRET);
        res.json({token : accessToken, success: true });
    } else {
        res.json({message : 'The password is incorrect', success: false })
    }
}

export const verifyToken = async (req,res) => {
    const token = req.body.token;

    //Verify if the token is valid
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,verifiedToken) => {
        if (err) return res.json({success : false})
        if (!verifiedToken) return res.json({success : false});

        return res.json({success : true});
    });
}
