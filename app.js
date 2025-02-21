const express= require('express');
require('dotenv').config();
const app=express();
const authRoutes=require('./controllers/authController');
const connectDB = require('./config/db');
const PORT=process.env.PORT || 3000;
const rateLimiter=require('express-rate-limit');

const limit= rateLimiter({
    windowMs: 15*60*1000,
    max:10,
    message:{error:"Too many requests,try again after sometime"},
    headers:true
});
app.use(limit);
app.use(express.json());
connectDB();
app.use('/auth',authRoutes);
app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})

