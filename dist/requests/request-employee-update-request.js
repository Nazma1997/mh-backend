"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestEmployeeUpdateStatusRequest = exports.RequestEmployeeUpdateRequest = void 0;
const express_validator_1 = require("express-validator");
const RequestEmployeeUpdateRequest = [
    (0, express_validator_1.body)("id").exists().trim().isMongoId().withMessage('Request employee id is required'),
    (0, express_validator_1.body)("employeeIds").exists().isArray().withMessage('Employees are required')
];
exports.RequestEmployeeUpdateRequest = RequestEmployeeUpdateRequest;
const RequestEmployeeUpdateStatusRequest = [
    (0, express_validator_1.body)("id").exists().trim().isMongoId().withMessage('Position is required'),
    (0, express_validator_1.body)("active").exists().isBoolean().withMessage('Status is required')
];
exports.RequestEmployeeUpdateStatusRequest = RequestEmployeeUpdateStatusRequest;
