import { body, oneOf } from "express-validator";

const CurrentHiredEmployeeUpdateRequest: any = [
    body("id").exists().trim().isMongoId().withMessage('Current hired employee is required'),
    oneOf([
        body("checkOut").exists().isBoolean().withMessage('Check out is required'),
        body("emmergencyCheckOut").exists().isBoolean().withMessage('Emmergency check out is required'),
    ]),
    body("breakTime").exists().isNumeric().withMessage('Break time is required'),
    body("emmergencyCheckOutComment").if(body('emmergencyCheckOut').equals('true')).exists().trim().isString().withMessage('Emmergency check out comment is required'),
    body("lat").exists().isString().notEmpty().withMessage('Lat is required'),
    body("long").exists().isString().withMessage('Long is required'),
    body("checkOutDistance").optional().notEmpty().isNumeric().withMessage('Long is required'),
];

const CurrentHiredEmployeeUpdateStatusRequest: any = [
    body("id").exists().trim().isMongoId().withMessage('Current hired employee is required'),
    oneOf([
        body("checkIn").exists().isBoolean().withMessage('Check in is required'),
        body("checkOut").exists().isBoolean().withMessage('Check out is required'),
    ]),
    body("clientCheckInTime").exists().isNumeric().withMessage('Client checkin is required'),
    body("clientCheckOutTime").exists().isNumeric().withMessage('Client checkout is required'),
    body("clientBreakTime").exists().isNumeric().withMessage('Client break time is required'),
    body("clientComment").exists().isString().withMessage('Client comment is required'),
];

export { CurrentHiredEmployeeUpdateRequest, CurrentHiredEmployeeUpdateStatusRequest };