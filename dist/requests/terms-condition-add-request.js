"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const PositionAddRequest = [
    (0, express_validator_1.body)("description").exists().trim().isString().withMessage('Description is required'),
    (0, express_validator_1.body)("active").exists().isBoolean().withMessage('Status is required')
];
exports.default = PositionAddRequest;
