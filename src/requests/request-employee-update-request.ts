import { body } from "express-validator";

const RequestEmployeeUpdateRequest: any = [
    body("id").exists().trim().isMongoId().withMessage('Request employee id is required'),
    body("employeeIds").exists().isArray().withMessage('Employees are required')
];

const RequestEmployeeUpdateStatusRequest: any = [
    body("id").exists().trim().isMongoId().withMessage('Position is required'),
    body("active").exists().isBoolean().withMessage('Status is required')
];

export { RequestEmployeeUpdateRequest, RequestEmployeeUpdateStatusRequest };