import { body } from "express-validator";

const TermsConditionUpdateRequest: any = [
    body("id").exists().trim().isMongoId().withMessage('Terms and condition is required'),
    body("description").exists().trim().isString().withMessage('Description is required'),
    body("active").exists().isBoolean().withMessage('Status is required')
];

const TermsConditionUpdateStatusRequest: any = [
    body("id").exists().trim().isMongoId().withMessage('Terms and condition is required'),
    body("active").exists().isBoolean().withMessage('Status is required')
];

export { TermsConditionUpdateRequest, TermsConditionUpdateStatusRequest };