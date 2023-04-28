"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdateStatusRequest = exports.UserUpdateRequest = void 0;
const express_validator_1 = require("express-validator");
//Validate input for mandatory fields
const UserUpdateRequest = [
    (0, express_validator_1.body)("id").exists().trim().notEmpty().isMongoId().withMessage("User id is required!"),
    (0, express_validator_1.body)("nidNumber").exists().trim().notEmpty().isString().withMessage('Please provide Govt. issued ID card number'),
    //body("passportNumber").exists().trim().notEmpty().isString().withMessage('Please provide your Passport number'),
    // body("companyName").exists().trim().notEmpty().isString().withMessage('Company Name is required'),
    // body("designation").exists().trim().notEmpty().isString().withMessage('Designation is required'),
];
exports.UserUpdateRequest = UserUpdateRequest;
//Validate input for mandatory fields
const UserUpdateStatusRequest = [
    (0, express_validator_1.body)("id").exists().trim().notEmpty().isMongoId().withMessage("User is required"),
    (0, express_validator_1.body)("active").exists().isBoolean().notEmpty().withMessage('Active status is required'),
    (0, express_validator_1.body)("deactivatedReason").optional().isString().notEmpty().withMessage('Reason is required'),
];
exports.UserUpdateStatusRequest = UserUpdateStatusRequest;
