"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const CurrentHiredEmployeeAddRequest = [
    (0, express_validator_1.body)("employeeId").exists().trim().isMongoId().withMessage('Employee is required'),
    (0, express_validator_1.oneOf)([
        (0, express_validator_1.body)("checkIn").exists().isBoolean().withMessage('Check in is required'),
        (0, express_validator_1.body)("emmergencyCheckIn").exists().isBoolean().withMessage('Emmergency check in is required'),
    ]),
    (0, express_validator_1.body)("emmergencyCheckInComment").if((0, express_validator_1.body)('emmergencyCheckIn').equals('true')).exists().trim().isString().withMessage('Emmergency check in comment is required'),
    (0, express_validator_1.body)("lat").exists().isString().notEmpty().withMessage('Lat is required'),
    (0, express_validator_1.body)("long").exists().isString().withMessage('Long is required'),
    (0, express_validator_1.body)("checkInDistance").optional().notEmpty().isNumeric().withMessage('Lat is required'),
];
exports.default = CurrentHiredEmployeeAddRequest;
