"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const config_1 = __importDefault(require("config"));
const phone_number_validator_helper_1 = require("../helpers/validators/phone-number-validator-helper");
const password_validator_helper_1 = require("../helpers/validators/password-validator-helper");
const otpLength = config_1.default.get("OTP_LENGTH");
const minPasswordLength = config_1.default.get("PASSWORD_MIN_LENGTH");
//Validate input for mandatory fields
const UserResetPasswordRequest = [
    (0, express_validator_1.body)("email").optional().isString().isEmail().withMessage('Email is not valid!'),
    (0, express_validator_1.body)("phoneNumber").optional().isString().isLength({ min: 4, max: 20 }).withMessage('Phone Number is not Valid!').custom((value, { req }) => {
        return (0, phone_number_validator_helper_1.isPhoneNumberValid)(req.body.phoneNumber, req.body.countryCode);
    }),
    (0, express_validator_1.body)("password").exists().trim().isString().notEmpty().isLength({ min: minPasswordLength }).withMessage(`Your password should contain minimum ${minPasswordLength} characters!`).custom((value, { req }) => {
        if (!req.body.email && !req.body.phoneNumber) {
            throw new Error('Email and phone number should not be empty!');
        }
        return (0, password_validator_helper_1.isPasswordValid)(req.body.password);
    }),
    (0, express_validator_1.body)("confirmPassword").exists().trim().notEmpty().isString().isLength({ min: minPasswordLength }).withMessage(`Confirm Password must contain minimum  ${minPasswordLength} characters!`).custom((value, { req }) => {
        return req.body.password === req.body.confirmPassword;
    }),
    (0, express_validator_1.body)("otpNumber").exists().trim().notEmpty().isString().isLength({ min: otpLength }).withMessage('You must enter the OTP!'),
];
exports.default = UserResetPasswordRequest;
