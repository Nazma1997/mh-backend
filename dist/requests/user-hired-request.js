"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
//Validate input for mandatory fields
const UserHiredRequest = [
    (0, express_validator_1.body)("hiredList").exists().notEmpty().isArray().withMessage("Hired list are required"),
];
exports.default = UserHiredRequest;
