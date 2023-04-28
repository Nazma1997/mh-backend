"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const PushNotificationUpdateRequest = [
    (0, express_validator_1.body)("uuid").exists().trim().isString().withMessage('Uuid is required'),
    (0, express_validator_1.body)("fcmToken").exists().trim().isString().withMessage('Fcm token is required'),
    (0, express_validator_1.body)("platform").exists().trim().isString().withMessage('Platform is required')
];
exports.default = PushNotificationUpdateRequest;
