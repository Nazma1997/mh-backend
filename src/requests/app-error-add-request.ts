import { body } from "express-validator";

const AppErrorAddRequest: any = [
    body("name").optional().trim().isString().withMessage('Name is required'),
    body("description").optional().trim().isString().withMessage('Description is required'),
    body("userId").optional().trim().isMongoId().withMessage('User is required'),
    body("active").optional().isBoolean().withMessage('Status is required')
];

export default AppErrorAddRequest;