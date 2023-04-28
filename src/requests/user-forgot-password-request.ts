import { body, oneOf } from "express-validator";

//Validate input for mandatory fields
const UserForgotPasswordRequest: any = [
    oneOf(
        [
            body("email").exists().isString().isEmail().withMessage('Invalid email address!'),
            body("userIdNumber").exists().isString().withMessage('User id number is invalid! Please check format!'),
        ]
    )
];

export default UserForgotPasswordRequest;