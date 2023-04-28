import { body } from "express-validator";

//Validate input for mandatory fields
const BankDressUpdateRequest: any = [
    body("id").exists().trim().notEmpty().isMongoId().withMessage("Employee is required!"),
    body("bankName").exists().trim().notEmpty().isString().withMessage('Bank name is required'),
    body("accountNumber").exists().trim().notEmpty().isString().withMessage('Account number is required'),
    body("routingNumber").exists().trim().notEmpty().isString().withMessage('Routing number is required'),
    body("dressSize").optional().notEmpty().isString().withMessage('Dress size is required'),
    body("additionalOne").optional().notEmpty().isString().withMessage('Additional one is required'),
    body("additionalTwo").optional().notEmpty().isString().withMessage('Additional two is required'),
];

export default BankDressUpdateRequest;