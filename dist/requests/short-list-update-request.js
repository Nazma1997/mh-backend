"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const ShortListUpdateRequest = [
    (0, express_validator_1.body)("id").exists().trim().isMongoId().withMessage('Short list is required'),
    (0, express_validator_1.body)("fromDate").exists().notEmpty().isDate().withMessage('From date is required'),
    (0, express_validator_1.body)("toDate").exists().notEmpty().isDate().withMessage('To date is required')
];
exports.default = ShortListUpdateRequest;
