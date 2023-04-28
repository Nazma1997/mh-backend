"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const AppappVersionRouterUpdateRequest = [
    (0, express_validator_1.body)("appVersion").exists().trim().isString().withMessage('App version is required'),
    (0, express_validator_1.body)("updateRequired").exists().isBoolean().withMessage('Update required is required')
];
exports.default = AppappVersionRouterUpdateRequest;
