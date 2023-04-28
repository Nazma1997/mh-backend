"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
//Validate input for mandatory fields
const HiredHistoryAddRequest = [
    (0, express_validator_1.body)("selectedShortlist").exists().notEmpty().isArray().withMessage("Selected short list are required"),
];
exports.default = HiredHistoryAddRequest;
