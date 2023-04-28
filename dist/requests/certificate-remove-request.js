"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const CertificateRemoveRequest = [
    (0, express_validator_1.body)("id").exists().trim().notEmpty().isMongoId().withMessage('Employee is required'),
    (0, express_validator_1.body)("certificateId").exists().trim().notEmpty().isMongoId().withMessage('Certificate name is required')
];
exports.default = CertificateRemoveRequest;
