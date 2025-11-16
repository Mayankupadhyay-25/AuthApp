const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// signup route handler
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "name, email and password are required",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "user already exist",
            });
        }

        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing Password",
            });
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        return res.status(201).json({
            success: true,
            message: "User created Successfully",
            userId: user._id,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "user cannot be registered, please try again later",
        });
    }
};

// login route handler
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email and password are required",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful",
            userId: user._id,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

//login
exports.login = async (req,res) => {
    try{
        //data fetch
        const{email,password} = req.body;
        //validation on email and password
        if (!email || !password) {
            return res.status(400).json({
                succuss:false,
                message:"please fill all the detials carefully",
            });
        }
    //check for register user 
    const user = await User.findOne({email})
    //if note register
    if(!user){
        return res.status(401).json({
            seccuss:false,
            message:"User is not registered"
        })
    }

    const paylode ={
        email:user.email,
        id:user._id,
        role:user.role
    };

    //verify password & generat a jwt token
    if(await bcrypt.compare(password,user.password)){
        //password match
        let token = jwt.sign(paylode, process.env.JWT_SECRET,{
            expiresIn:"2h"
        });

        user.token = token;
        user.password = undefined;
        const options = {
            expires:new Date(Date.now()+ 3  * 24 * 60 * 1000),
            httpOnly:true,
        }

        res.cookie("token", token, options).status(200).json({
            sucess:true,
            token,
            user,
            message:"user logged in successfully"
        }); 
    }
    else{
        // password do not match
        return res.status(403).json({
            success:false,
            message:"Password Incorrect",
        });
    }
      
}
catch(error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Login Failure"
        
    });
    }
      
}