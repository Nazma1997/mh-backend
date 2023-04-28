import { body, oneOf } from "express-validator";
// import { isPhoneNumberValid } from "../helpers/validators/phone-number-validator-helper";

const UserLoginRequest: any = [
    oneOf([
        body("email").exists().isString().isEmail().withMessage('Invalid email address!'),
        body("userIdNumber").exists().isString().withMessage('User id number is required'),
    ]),
    body("password").exists().trim().isString().notEmpty().withMessage('You must enter a password!'),
];

export default UserLoginRequest;