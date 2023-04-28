"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const AppErrorAddRequest = [
    (0, express_validator_1.body)("name").optional().trim().isString().withMessage('Name is required'),
    (0, express_validator_1.body)("description").optional().trim().isString().withMessage('Description is required'),
    (0, express_validator_1.body)("userId").optional().trim().isMongoId().withMessage('User is required'),
    (0, express_validator_1.body)("active").optional().isBoolean().withMessage('Status is required')
];
exports.default = AppErrorAddRequest;
