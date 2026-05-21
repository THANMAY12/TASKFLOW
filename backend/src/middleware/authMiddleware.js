const jwt=require('jsonwebtoken');
const User=require('../models/User');

const protect=async (requestAnimationFrame,res,next)=>{
    try{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token=req.headers.authorization.split(" ")[1];
        }
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Not authorized, no token",
            })
        }
        const verify=jwt.verify(token,process.env.JWT_SECRET);
        req.user=await User.findOne(verify.id).select("-password");
        next();
    }catch(error){
        return res.status(401).json({
                success:false,
                message:"Not authorized",
            })
    }
}

module.exports=protect;