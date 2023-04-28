"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceUpdateStatusRequest = exports.SourceUpdateRequest = void 0;
const express_validator_1 = require("express-validator");
const source_service_1 = require("../services/source-service");
const SourceUpdateRequest = [
    (0, express_validator_1.body)("id").exists().trim().isMongoId().withMessage('Source from is required'),
    (0, express_validator_1.body)("name").exists().trim().isString().withMessage('Name is required').custom((value, { req }) => {
        return (0, source_service_1.sourceAlreadyIsNotExists)(req.body.name, req.body.id);
    }),
    (0, express_validator_1.body)("active").exists().isBoolean().withMessage('Status is required')
];
exports.SourceUpdateRequest = SourceUpdateRequest;
const SourceUpdateStatusRequest = [
    (0, express_validator_1.body)("id").exists().trim().isMongoId().withMessage('Source from is required'),
    (0, express_validator_1.body)("active").exists().isBoolean().withMessage('Status is required')
];
exports.SourceUpdateStatusRequest = SourceUpdateStatusRequest;
