import { body } from "express-validator";

const PositionAddRequest: any = [
    body("description").exists().trim().isString().withMessage('Description is required'),
    body("active").exists().isBoolean().withMessage('Status is required')
];

export default PositionAddRequest;