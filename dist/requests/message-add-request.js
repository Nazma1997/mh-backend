"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const MessageAddRequest = [
    (0, express_validator_1.body)("receiverId").exists().trim().isMongoId().withMessage('Receiver is required'),
    (0, express_validator_1.body)("senderId").exists().trim().isMongoId().withMessage('Sender is required'),
    (0, express_validator_1.body)("text").exists().trim().isString().withMessage('Text is required'),
];
exports.default = MessageAddRequest;
