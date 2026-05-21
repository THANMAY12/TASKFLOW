const bcrypt=require('bcryptjs')
const User=require('../models/User')
const generateToken=require('../utils/generateToken')

// Register the user

const registerUser=async (req,res)=>{
    try{
        const{name,email,password}=req.body;
        const userExists=User.findOne({email});
        if(!userExists){
            return res.status(400).json({
                success:false,
                message:"User exists"
            })
        }
        const salt=await bcrypt.genSalt(5);
        const hashPasswrd=await bcrypt.hash(password,salt);

        const user=await User.create({
            name,email,
            password:hashPasswrd
        });
        const token=generateToken(user._id,user.role);
        res.status(201).json({
            success:true,
            message:"User sucessfully registered",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
};

// login 
const loginUser=async (req,res)=>{
    try{
        const {email, password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid credentials"
            })
        }

        const isMatching=await bcrypt.compare(password,user.password);
        if(!isMatching){
            return res.status(401).json({
                success:false,
                message:"Invalid credentials"
            })
        }
        //generate jwt
        const token=generateToken(user._id,user.role)
        res.status(200).json({
            success:true,
            message:"Login sucessful",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

module.exports={registerUser,loginUser};