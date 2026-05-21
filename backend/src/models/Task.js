const mongoose=require('mongoose');
const { applyTimestamps } = require('./User');
const taskSchema=mongoose.Schema({
    title:{
        type:String,
        required:[true,"Task title is required"],
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    status:{
        type:String,
        enum:["pending","in-progress","completed"],
        default:"pending"
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{
    timestamps: true,
}
)

module.exports=mongoose.model("Task",taskSchema)