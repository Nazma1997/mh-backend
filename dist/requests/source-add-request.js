"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const source_service_1 = require("../services/source-service");
const SourceFromAddRequest = [
    (0, express_validator_1.body)("name").exists().trim().isString().withMessage('Name is required').custom((value, { req }) => {
        return (0, source_service_1.sourceAlreadyIsNotExists)(req.body.name);
    }),
    (0, express_validator_1.body)("active").exists().isBoolean().withMessage('Status is required')
];
exports.default = SourceFromAddRequest;
