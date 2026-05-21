const Task=require('../models/Task')

const createTask=async (req,res)=>{
    try{
        const {title, description, status}=req.body;
        const task=await Task.create({
            title,
            description,
            status,
            createdBy:req.user._id
        });
        res.status(201).json({
            success:true,
            message:"Task created"
        })
    }
    catch(error){
        res.status(500).json({
      success: false,
      message: error.message,
    });
    }
}

const getTasks= async (req,res)=>{
    try{
        let tasks;
        if(req.user.role==="admin"){
            tasks=await Task.find().populate("createdBy","name email");
        }
        else{
            tasks=await Task.find({
                createdBy:req.user._id
            })
        }
        res.status(200).json({
            success:true,
            count:tasks.length,
            tasks
        })
    }
    catch(error){
        res.status(500).json({
            success:true,
            message: error.message
        })
    }
}

const updateTask= async (req,res)=>{
    try{
        const task=await Task.findById(req.params.id);
        if(!task){
            return res.status(404).json({
                success:false,
                message:"Task not found"
            })
        }
        if(task.createdBy.toString()!==req.user._id.toString()&& req.user.role!=="admin"){
            return res.status(403).json({
                success:false,
                message:"Access denied"
            })
        }
        const updatedTask=await Task.findByIdAndUpdate(req.params.id,
            req.body,
            {
                returnDocument:"after",
                runValidators:true
            }
        )
        res.status(200).json({
        success: true,
        message: "Task updated successfully",
        updatedTask,
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: error.message,
        });
    }
}

const deleteTask=async (req,res)=>{
    try{
        const task=await Task.findById(req.params.id);
        if(!task){
            return res.status(404).json({
                success:false,
                message:"Task not found"
            })
        }
        if (
      task.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    await task.deleteOne();
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });

  }catch(error) {
    res.status(500).json({
      success:false,
      message:error.message,
    })
  }
};

module.exports={createTask,getTasks,updateTask,deleteTask};
