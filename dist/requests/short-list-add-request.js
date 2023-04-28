"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const short_list_service_1 = require("../services/short-list-service");
const ShortListAddRequest = [
    (0, express_validator_1.body)("employeeId").exists().notEmpty().isMongoId().withMessage('Employee is required').custom((value, { req }) => {
        return (0, short_list_service_1.shortListAlreadyIsNotExists)(req.body.employeeId, req.user._id);
    }),
];
exports.default = ShortListAddRequest;
