const express=require('express');
const { createTask, updateTask, deleteTask, getTasks } = require('../controllers/taskController');

const protect=require('../middleware/authMiddleware')
const validationMiddleware =require('../middleware/validateMiddleware');
const { taskValidation } = require('../validators/taskValidator');

const router =express.Router();

//Create Task
router.post("/",protect,taskValidation,validationMiddleware,createTask);

//Get task
router.get("/", protect, getTasks);

//Update Task
router.put("/:id", protect, updateTask);


//Delete Task
router.delete("/:id", protect, deleteTask);

module.exports = router;