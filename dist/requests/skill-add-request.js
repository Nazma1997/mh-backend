"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const skill_service_1 = require("../services/skill-service");
const SkillAddRequest = [
    (0, express_validator_1.body)("name").exists().trim().isString().withMessage('Name is required').custom((value, { req }) => {
        return (0, skill_service_1.skillAlreadyIsNotExists)(req.body.name);
    }),
    (0, express_validator_1.body)("active").exists().isBoolean().withMessage('Status is required')
];
exports.default = SkillAddRequest;
