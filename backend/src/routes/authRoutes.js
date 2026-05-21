const express=require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { registerUserValidation, loginValidation } = require('../validators/authValidator');
const validationMiddleware = require('../middleware/validateMiddleware');

const router=express.Router();

router.post("/register",registerUserValidation,validationMiddleware,registerUser);
router.post("/login",loginValidation,validationMiddleware,loginUser);

module.exports=router;
