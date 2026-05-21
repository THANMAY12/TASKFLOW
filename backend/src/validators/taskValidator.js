const {body}=require("express-validator");

const taskValidation=[
    body("title").notEmpty().withMessage("Task title is required"),

    body("status").isIn(["pending","in-progress","completed"]).withMessage("Invalid task status")
];
module.exports={taskValidation}