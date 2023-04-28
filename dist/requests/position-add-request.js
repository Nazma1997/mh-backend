"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const position_service_1 = require("../services/position-service");
const PositionAddRequest = [
    (0, express_validator_1.body)("name").exists().trim().isString().withMessage('Name is required').custom((value, { req }) => {
        return (0, position_service_1.positionAlreadyIsNotExists)(req.body.name);
    }),
    (0, express_validator_1.body)("active").exists().isBoolean().withMessage('Status is required')
];
exports.default = PositionAddRequest;
