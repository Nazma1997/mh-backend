"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const ConversationAddRequest = [
    (0, express_validator_1.body)("senderId").exists().trim().isMongoId().withMessage('Sender is required'),
    (0, express_validator_1.body)("receiverId").exists().trim().isMongoId().withMessage('Receiver is required'),
];
exports.default = ConversationAddRequest;
