const express=require('express');
const cors=require('cors');
const morgan=require('morgan')
const helmet=require('helmet');
const authRoutes=require('./routes/authRoutes')

const app=express();

//Middlewares

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

//Routes
app.use("/api/v1/auth",authRoutes)

//Test route
app.get('/api',(req,res)=>{
    res.status(200).json({
        success:true,
        message: "Api running"
    })
})
module.exports=app;