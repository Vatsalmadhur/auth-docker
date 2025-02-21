const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const User = require('../models/userModel');
const jwt= require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const nodemailer = require("nodemailer");
router.post('/login',async (req,res)=>{
    try{
    const {email,password}=req.body;
    const user= await User.findOne({email});
    if(!user) return res.status(400).json({message:"User does not Exist"});

   const isMatch= await bcrypt.compare(password,user.password);
   if(!isMatch) return res.status(400).json({message:"Invalid Creds.."})

   const accessToken=jwt.sign({userId:user._id,email:email},process.env.JWT_SECRET,{expiresIn:"1h"});
    const refreshToken = jwt.sign({userId:user._id,email:email},process.env.REFRESH_SECRET,{expiresIn:"7d"});
    user.refreshToken=refreshToken;
    await user.save();
   res.status(200).json({message:"Sign in success",accessToken:accessToken,refreshToken:refreshToken});
    }
    catch(error){res.status(500).json({error:error.message})}
});

router.post('/register',async (req,res)=>{
    try{
        const{username,email,password}=req.body;
        let user= await User.findOne({username,email});
        if(user) return res.status(400).json({message:'user already exists'});

        const salt=await bcrypt.genSalt(10);
        const hashedPass= await bcrypt.hash(password,salt);

         user= await User.create({username,email,password:hashedPass});
        await user.save();
        res.status(201).json({message:"User created"});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})

router.get('/profile',authMiddleware,async (req,res)=>{
    const user= await User.findOne({email:req.user.email}).select("-password");
    if(!user)
    return res.status(404).json({message:"User Not found"});
    res.json(user);
})

router.post('/refresh', async (req,res)=>{
    const {token}=req.body;
    if(!token) return res.status(401).json({message:"No refresh token found"});
    
    try{
        const user = await User.findOne({refreshToken:token});
        if(!user) return res.status(403).json({ message: "Invalid refresh token" });

        jwt.verify(token,process.env.REFRESH_SECRET,async (err)=>{
             if (err) return res.status(403).json({ message: "Invalid refresh token" });


            const newAccToken= jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'1h'});
            const newRefToken= jwt.sign({userId:user._id},process.env.REFRESH_SECRET,{expiresIn:'7d'});

            user.refreshToken=newRefToken;
            await user.save();

            res.json({ accessToken: newAccToken, refreshToken: newRefToken });
        })
     } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout',async (req,res)=>{
 try{   
    const {token}=req.body;
    const user = await User.findOne({refreshToken:token});
    if(!user) return res.status(400).json({message:"User not found"});

    user.refreshToken=null;
    await user.save();
    res.json({message:"Logged out successfully"});
} catch(err){
         res.status(500).json({ error: err.message });
    }
});

router.post('/reset-password-request',async (req,res)=>{
try{
        const {email}= req.body;
        const user = await User.findOne({email});
        if(!user) return res.json({message:"user not found"});

        const resetToken = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'15m'});

        const transporter = nodemailer.createTransport({
            service:"Gmail",
            auth:{user:process.env.EMAIL,pass:process.env.PASS}
        });
         const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Password Reset",
            text: `Click the link to reset password: http://localhost:3000/auth/reset-password/${resetToken}`
        };

        await transporter.sendMail(mailOptions);
        res.json({message:"Email sent"})
    }
    catch(err){
        res.status(500).json({error:err});
    }

})

router.post('/reset-password',async (req,res)=>{
    try{
        const {token,newPass}=req.body;

        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPass,salt);

        await user.save();

        res.json({ message: "Password reset successful" });
    }
    catch(err){
        res.status(403).json({error:err});
    }
})

module.exports=router;

