"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const RequestEmployeeAddRequest = [
    (0, express_validator_1.body)("requestClientId").exists().trim().isMongoId().withMessage('Client is required'),
    (0, express_validator_1.body)("employees").exists().isArray().withMessage('Request employees are required')
];
exports.default = RequestEmployeeAddRequest;
