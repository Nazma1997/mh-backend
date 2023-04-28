"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const UserReferPersonUpdateRequest = [
    (0, express_validator_1.body)("id").exists().trim().isMongoId().withMessage('Refer person is required'),
    (0, express_validator_1.body)("isReferPerson").exists().isBoolean().withMessage('Status is required')
];
exports.default = UserReferPersonUpdateRequest;
