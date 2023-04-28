import { body } from "express-validator";

const ClientDiscountUpdateRequest: any = [
    body("id").exists().trim().isMongoId().withMessage('Client is required'),
    body("clientDiscount").exists().isNumeric().withMessage('Discount is required')
];

export default ClientDiscountUpdateRequest;