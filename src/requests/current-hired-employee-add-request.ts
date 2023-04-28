import { body, oneOf } from "express-validator";

const CurrentHiredEmployeeAddRequest: any = [
    body("employeeId").exists().trim().isMongoId().withMessage('Employee is required'),
    oneOf([
        body("checkIn").exists().isBoolean().withMessage('Check in is required'),
        body("emmergencyCheckIn").exists().isBoolean().withMessage('Emmergency check in is required'),
    ]),
    body("emmergencyCheckInComment").if(body('emmergencyCheckIn').equals('true')).exists().trim().isString().withMessage('Emmergency check in comment is required'),
    body("lat").exists().isString().notEmpty().withMessage('Lat is required'),
    body("long").exists().isString().withMessage('Long is required'),
    body("checkInDistance").optional().notEmpty().isNumeric().withMessage('Lat is required'),
];

export default CurrentHiredEmployeeAddRequest;