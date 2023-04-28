"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubUserPasswordUpdateRequest = exports.UserPasswordUpdateRequest = void 0;
const express_validator_1 = require("express-validator");
const config_1 = __importDefault(require("config"));
const password_validator_helper_1 = require("../helpers/validators/password-validator-helper");
const minPasswordLength = config_1.default.get("PASSWORD_MIN_LENGTH");
//Validate input for mandatory fields
const UserPasswordUpdateRequest = [
    (0, express_validator_1.body)("id").exists().trim().notEmpty().isMongoId().withMessage("User is required!"),
    (0, express_validator_1.body)("newPassword").exists().trim().notEmpty().isString().isLength({ min: minPasswordLength }).withMessage(`Password must contain minimum ${minPasswordLength} characters!`).custom((value, { req }) => {
        return (0, password_validator_helper_1.isPasswordValid)(req.body.newPassword);
    }),
    (0, express_validator_1.body)("currentPassword").exists().trim().notEmpty().isString().isLength({ min: minPasswordLength }).withMessage(`Password must contain minimum ${minPasswordLength} characters!`).custom((value, { req }) => {
        return (0, password_validator_helper_1.isCurrentPassword)(req.body.id, req.body.currentPassword);
    })
];
exports.UserPasswordUpdateRequest = UserPasswordUpdateRequest;
//Validate input for mandatory fields
const SubUserPasswordUpdateRequest = [
    (0, express_validator_1.body)("id").exists().trim().notEmpty().isMongoId().withMessage("User id is required!"),
    (0, express_validator_1.body)("newPassword").exists().trim().notEmpty().isString().isLength({ min: minPasswordLength }).withMessage(`Password must contain minimum ${minPasswordLength} characters!`).custom((value, { req }) => {
        return (0, password_validator_helper_1.isPasswordValid)(req.body.newPassword);
    }),
];
exports.SubUserPasswordUpdateRequest = SubUserPasswordUpdateRequest;
