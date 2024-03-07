const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const User = require("../models/user");
const Admin = require("../models/admin");

router.post("/signup", [
    body('email')
    .notEmpty().withMessage("Email is required. "),
    body('name')
    .notEmpty().withMessage("Name is required. ")
    .isLength({min: 3}).withMessage("Name should contain at least 3 characters. "),
    body('password')
    .notEmpty().withMessage("Password is required. ")
    .isLength({min: 6}).withMessage("Password should contain at least 6 characters. ")
], async (req, res)=>{
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        let err = errors.errors.map(error=>{
            return error.msg;
        })
        res.status(400).json(err)
    }else{
    const {name, email, password} = req.body;
    try{
        var existingUser = await User.findOne({email: email})
    }
    catch(error){
        res.status(400).json(error)
    }
    if(existingUser){
        res.status(400).json({message: "This email is already in use"})
    }
    else{
    let newUser = new User({
        name: name, 
        email: email, 
        password: password,
        role: "user"
    });
    newUser.save()
    .then(()=>{
        res.status(200).json({success: true, data: newUser})
    })
    .catch(error=>{
        res.status(400).json(error)
    })
}
}
});

router.post("/login", async (req, res)=>{
    const {email, password} = req.body;
    let existingUser = null;
    try{
        existingUser = await User.findOne({email: email})
        if(!existingUser){
            existingUser = await Admin.findOne({email: email})
        }
    }
    catch{
        res.status(400).json({message: "Something went wrong"})
    }
    if(!existingUser || password != existingUser.password){
        res.status(400).json({message: "Invalid Username or Password"})
    }else{
        let token;
        token = jwt.sign({
            userId: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role
        }, "mashup_secret_key")
        res.status(200).json(token);
    }
});

router.post("/logout", (req, res)=>{
    let token = req.headers.authorization.split(' ')[1];
    if(!token){
        res.status(400).json({success: false, message: "Error! Token was not provided"})
    }
    try{
    let decodedToken = jwt.verify(token, "mashup_secret_key");
    res.status(200).json({success: true, data: {userId: decodedToken._id, email: decodedToken.email}});
    }
    catch(error){
        res.status(400).json({message: "Token expired"})
    }
});

module.exports = router;