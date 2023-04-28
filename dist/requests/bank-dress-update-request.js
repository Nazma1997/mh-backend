"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
//Validate input for mandatory fields
const BankDressUpdateRequest = [
    (0, express_validator_1.body)("id").exists().trim().notEmpty().isMongoId().withMessage("Employee is required!"),
    (0, express_validator_1.body)("bankName").exists().trim().notEmpty().isString().withMessage('Bank name is required'),
    (0, express_validator_1.body)("accountNumber").exists().trim().notEmpty().isString().withMessage('Account number is required'),
    (0, express_validator_1.body)("routingNumber").exists().trim().notEmpty().isString().withMessage('Routing number is required'),
    (0, express_validator_1.body)("dressSize").optional().notEmpty().isString().withMessage('Dress size is required'),
    (0, express_validator_1.body)("additionalOne").optional().notEmpty().isString().withMessage('Additional one is required'),
    (0, express_validator_1.body)("additionalTwo").optional().notEmpty().isString().withMessage('Additional two is required'),
];
exports.default = BankDressUpdateRequest;
