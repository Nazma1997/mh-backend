import { body } from "express-validator";

const RequestEmployeeAddRequest: any = [
    body("requestClientId").exists().trim().isMongoId().withMessage('Client is required'),
    body("employees").exists().isArray().withMessage('Request employees are required')
];

export default RequestEmployeeAddRequest;