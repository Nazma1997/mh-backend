"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
//Validate input for mandatory fields
const UserForgotPasswordRequest = [
    (0, express_validator_1.oneOf)([
        (0, express_validator_1.body)("email").exists().isString().isEmail().withMessage('Invalid email address!'),
        (0, express_validator_1.body)("userIdNumber").exists().isString().withMessage('User id number is invalid! Please check format!'),
    ])
];
exports.default = UserForgotPasswordRequest;
