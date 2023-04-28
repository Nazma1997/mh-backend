"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const config_1 = __importDefault(require("config"));
const user_service_1 = require("../services/user-service");
const minPasswordLength = config_1.default.get("PASSWORD_MIN_LENGTH");
//check mandatory fields
const MhEmployeeUpdateRequest = [
    (0, express_validator_1.body)("id").exists().trim().isMongoId().withMessage('Employee is required'),
    (0, express_validator_1.body)("name").exists().trim().notEmpty().isString().withMessage('Please enter employee name!'),
    (0, express_validator_1.body)("email").exists().trim().notEmpty().isEmail().withMessage('Please enter a valid email address!').custom((value, { req }) => {
        return (0, user_service_1.emailAlreadyIsNotExists)(req.body.email, req.body.id);
    }),
    (0, express_validator_1.body)("phoneNumber").exists().trim().notEmpty().isString().withMessage('Please enter a valid phone number!').custom((value, { req }) => {
        return (0, user_service_1.phoneNumberAlreadyIsNotExists)(req.body.phoneNumber, req.body.id);
    }),
    (0, express_validator_1.body)("role").exists().trim().notEmpty().isString().withMessage('Please enter role name!'),
    (0, express_validator_1.body)("permissions").exists().notEmpty().isArray().withMessage('Please enter permission!'),
    (0, express_validator_1.body)("active").exists().notEmpty().isBoolean().withMessage('Please enter status!'),
];
exports.default = MhEmployeeUpdateRequest;
