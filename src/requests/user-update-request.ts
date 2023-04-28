import { body } from "express-validator";

//Validate input for mandatory fields
const UserUpdateRequest: any = [
    body("id").exists().trim().notEmpty().isMongoId().withMessage("User id is required!"),
    body("nidNumber").exists().trim().notEmpty().isString().withMessage('Please provide Govt. issued ID card number'),
    //body("passportNumber").exists().trim().notEmpty().isString().withMessage('Please provide your Passport number'),
    // body("companyName").exists().trim().notEmpty().isString().withMessage('Company Name is required'),
    // body("designation").exists().trim().notEmpty().isString().withMessage('Designation is required'),

];

//Validate input for mandatory fields
const UserUpdateStatusRequest: any = [
    body("id").exists().trim().notEmpty().isMongoId().withMessage("User is required"),
    body("active").exists().isBoolean().notEmpty().withMessage('Active status is required'),
    body("deactivatedReason").optional().isString().notEmpty().withMessage('Reason is required'),
];

export { UserUpdateRequest, UserUpdateStatusRequest };