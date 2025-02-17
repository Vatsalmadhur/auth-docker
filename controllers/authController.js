const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const User = require('../models/userModel');
const jwt= require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login',async (req,res)=>{
    try{
    const {email,password}=req.body;
    const user= await User.findOne({email});
    if(!user) return res.status(400).json({message:"User does not Exist"});

   const isMatch= await bcrypt.compare(password,user.password);
   if(!isMatch) res.status(400).json({message:"Invalid Creds.."})

   const token=jwt.sign({userId:user._id,email:email},process.env.JWT_SECRET,{expiresIn:"1h"});
   res.status(200).json({message:"Sign in success",token:token})
    }
    catch(error){res.status(500).json({error:error.message})}
});

router.post('/register',async (req,res)=>{
    try{
        const{username,email,password}=req.body;
        const user= await User.findOne({username,email});
        if(user) return res.status(400).json({message:'user already exists'});

        const salt=bcrypt.genSalt(10);
        const hashedPass=bcrypt.hash(password,salt);

        user= await User.create({username,email,hashedPass});
        await user.save();
        res.status(201).json({message:"User created"});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})

router.get('/profile',authMiddleware,async (req,res)=>{
    const user= await User.findById(req.user).select("-password");
    if(!user)
    res.status(404).json({message:"User Not found"});

    res.json(user);
})

module.exports=router;

