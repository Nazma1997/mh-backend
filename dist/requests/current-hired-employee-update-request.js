"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentHiredEmployeeUpdateStatusRequest = exports.CurrentHiredEmployeeUpdateRequest = void 0;
const express_validator_1 = require("express-validator");
const CurrentHiredEmployeeUpdateRequest = [
    (0, express_validator_1.body)("id").exists().trim().isMongoId().withMessage('Current hired employee is required'),
    (0, express_validator_1.oneOf)([
        (0, express_validator_1.body)("checkOut").exists().isBoolean().withMessage('Check out is required'),
        (0, express_validator_1.body)("emmergencyCheckOut").exists().isBoolean().withMessage('Emmergency check out is required'),
    ]),
    (0, express_validator_1.body)("breakTime").exists().isNumeric().withMessage('Break time is required'),
    (0, express_validator_1.body)("emmergencyCheckOutComment").if((0, express_validator_1.body)('emmergencyCheckOut').equals('true')).exists().trim().isString().withMessage('Emmergency check out comment is required'),
    (0, express_validator_1.body)("lat").exists().isString().notEmpty().withMessage('Lat is required'),
    (0, express_validator_1.body)("long").exists().isString().withMessage('Long is required'),
    (0, express_validator_1.body)("checkOutDistance").optional().notEmpty().isNumeric().withMessage('Long is required'),
];
exports.CurrentHiredEmployeeUpdateRequest = CurrentHiredEmployeeUpdateRequest;
const CurrentHiredEmployeeUpdateStatusRequest = [
    (0, express_validator_1.body)("id").exists().trim().isMongoId().withMessage('Current hired employee is required'),
    (0, express_validator_1.oneOf)([
        (0, express_validator_1.body)("checkIn").exists().isBoolean().withMessage('Check in is required'),
        (0, express_validator_1.body)("checkOut").exists().isBoolean().withMessage('Check out is required'),
    ]),
    (0, express_validator_1.body)("clientCheckInTime").exists().isNumeric().withMessage('Client checkin is required'),
    (0, express_validator_1.body)("clientCheckOutTime").exists().isNumeric().withMessage('Client checkout is required'),
    (0, express_validator_1.body)("clientBreakTime").exists().isNumeric().withMessage('Client break time is required'),
    (0, express_validator_1.body)("clientComment").exists().isString().withMessage('Client comment is required'),
];
exports.CurrentHiredEmployeeUpdateStatusRequest = CurrentHiredEmployeeUpdateStatusRequest;
