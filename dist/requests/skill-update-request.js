"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillUpdateStatusRequest = exports.SkillUpdateRequest = void 0;
const express_validator_1 = require("express-validator");
const skill_service_1 = require("../services/skill-service");
const SkillUpdateRequest = [
    (0, express_validator_1.body)("id").exists().trim().isMongoId().withMessage('Skill is required'),
    (0, express_validator_1.body)("name").exists().trim().isString().withMessage('Name is required').custom((value, { req }) => {
        return (0, skill_service_1.skillAlreadyIsNotExists)(req.body.name, req.body.id);
    }),
    (0, express_validator_1.body)("active").exists().isBoolean().withMessage('Status is required')
];
exports.SkillUpdateRequest = SkillUpdateRequest;
const SkillUpdateStatusRequest = [
    (0, express_validator_1.body)("id").exists().trim().isMongoId().withMessage('Skill is required'),
    (0, express_validator_1.body)("active").exists().isBoolean().withMessage('Status is required')
];
exports.SkillUpdateStatusRequest = SkillUpdateStatusRequest;
