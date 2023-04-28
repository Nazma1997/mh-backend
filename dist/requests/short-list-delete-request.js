"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const ShortListDeleteRequest = [
    (0, express_validator_1.body)("id").exists().trim().isMongoId().withMessage('Short list is required')
];
exports.default = ShortListDeleteRequest;
