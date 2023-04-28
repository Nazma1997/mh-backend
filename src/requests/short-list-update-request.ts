import { body } from "express-validator";

const ShortListUpdateRequest: any = [
    body("id").exists().trim().isMongoId().withMessage('Short list is required'),
    body("fromDate").exists().notEmpty().isDate().withMessage('From date is required'),
    body("toDate").exists().notEmpty().isDate().withMessage('To date is required')
];

export default ShortListUpdateRequest;