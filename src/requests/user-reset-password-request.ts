import { body } from "express-validator";
import config from "config";

import { isPhoneNumberValid } from "../helpers/validators/phone-number-validator-helper";
import { isPasswordValid } from "../helpers/validators/password-validator-helper";

const otpLength = config.get<number>("OTP_LENGTH");
const minPasswordLength = config.get<number>("PASSWORD_MIN_LENGTH");

//Validate input for mandatory fields
const UserResetPasswordRequest: any = [
    body("email").optional().isString().isEmail().withMessage('Email is not valid!'),
    body("phoneNumber").optional().isString().isLength({ min: 4, max: 20 }).withMessage('Phone Number is not Valid!').custom((value: string, { req }) => {
        return isPhoneNumberValid(req.body.phoneNumber, req.body.countryCode);
    }),
    body("password").exists().trim().isString().notEmpty().isLength({ min: minPasswordLength }).withMessage(`Your password should contain minimum ${minPasswordLength} characters!`).custom((value: string, { req }) => {
        if (!req.body.email && !req.body.phoneNumber) {
            throw new Error('Email and phone number should not be empty!')
        }

        return isPasswordValid(req.body.password)
    }),
    body("confirmPassword").exists().trim().notEmpty().isString().isLength({ min: minPasswordLength }).withMessage(`Confirm Password must contain minimum  ${minPasswordLength} characters!`).custom((value: string, { req }) => {
        return req.body.password === req.body.confirmPassword;
    }),
    body("otpNumber").exists().trim().notEmpty().isString().isLength({ min: otpLength }).withMessage('You must enter the OTP!'),
];

export default UserResetPasswordRequest;