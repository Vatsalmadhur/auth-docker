const express= require('express');
require('dotenv').config();
const app=express();
const authRoutes=require('./controllers/authController');
const connectDB = require('./config/db');
const PORT=process.env.PORT || 3000;

app.use(express.json());
connectDB();
app.use('/',(req,res)=>{
    res.json({msg:"hello world"})
});
app.use('/auth',authRoutes);
app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})

