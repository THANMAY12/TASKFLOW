const {body}=require('express-validator')

const registerUserValidation=[
    body("name").notEmpty().withMessage("Name is required"),

    body("email").isEmail().withMessage("Valid email required"),

    body("password").isLength({min:6}).withMessage("Password should be of at least 6 characters")
];

const loginValidation=[
    body("email").isEmail().withMessage("Valid email required"),

    body("password").isLength({min:6}).withMessage("Password should be of at least 6 characters")
];

module.exports={registerUserValidation, loginValidation}
