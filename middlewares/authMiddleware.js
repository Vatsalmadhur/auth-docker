const jwt=require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const authMiddleware=(req,res,next)=>{
    const token=req.header("Authorization")
    if(!token) return res.status(401).json({message:"Access Denied:No token found"});
    try{
        const decoded= jwt.verify(token.replace("Bearer","").trim(),JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
}

module.exports=authMiddleware;
