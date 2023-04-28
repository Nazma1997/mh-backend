"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const ClientDiscountUpdateRequest = [
    (0, express_validator_1.body)("id").exists().trim().isMongoId().withMessage('Client is required'),
    (0, express_validator_1.body)("clientDiscount").exists().isNumeric().withMessage('Discount is required')
];
exports.default = ClientDiscountUpdateRequest;
