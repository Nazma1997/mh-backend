"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
// import { isPhoneNumberValid } from "../helpers/validators/phone-number-validator-helper";
const UserLoginRequest = [
    (0, express_validator_1.oneOf)([
        (0, express_validator_1.body)("email").exists().isString().isEmail().withMessage('Invalid email address!'),
        (0, express_validator_1.body)("userIdNumber").exists().isString().withMessage('User id number is required'),
    ]),
    (0, express_validator_1.body)("password").exists().trim().isString().notEmpty().withMessage('You must enter a password!'),
];
exports.default = UserLoginRequest;
