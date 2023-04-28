"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsConditionUpdateStatusRequest = exports.TermsConditionUpdateRequest = void 0;
const express_validator_1 = require("express-validator");
const TermsConditionUpdateRequest = [
    (0, express_validator_1.body)("id").exists().trim().isMongoId().withMessage('Terms and condition is required'),
    (0, express_validator_1.body)("description").exists().trim().isString().withMessage('Description is required'),
    (0, express_validator_1.body)("active").exists().isBoolean().withMessage('Status is required')
];
exports.TermsConditionUpdateRequest = TermsConditionUpdateRequest;
const TermsConditionUpdateStatusRequest = [
    (0, express_validator_1.body)("id").exists().trim().isMongoId().withMessage('Terms and condition is required'),
    (0, express_validator_1.body)("active").exists().isBoolean().withMessage('Status is required')
];
exports.TermsConditionUpdateStatusRequest = TermsConditionUpdateStatusRequest;
