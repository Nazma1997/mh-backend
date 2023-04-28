"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionUpdateStatusRequest = exports.PositionUpdateRequest = void 0;
const express_validator_1 = require("express-validator");
const position_service_1 = require("../services/position-service");
const PositionUpdateRequest = [
    (0, express_validator_1.body)("id").exists().trim().isMongoId().withMessage('Position is required'),
    (0, express_validator_1.body)("name").exists().trim().isString().withMessage('Name is required').custom((value, { req }) => {
        return (0, position_service_1.positionAlreadyIsNotExists)(req.body.name, req.body.id);
    }),
    (0, express_validator_1.body)("active").exists().isBoolean().withMessage('Status is required')
];
exports.PositionUpdateRequest = PositionUpdateRequest;
const PositionUpdateStatusRequest = [
    (0, express_validator_1.body)("id").exists().trim().isMongoId().withMessage('Position is required'),
    (0, express_validator_1.body)("active").exists().isBoolean().withMessage('Status is required')
];
exports.PositionUpdateStatusRequest = PositionUpdateStatusRequest;
