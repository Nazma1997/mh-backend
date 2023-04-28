import { body } from "express-validator";

const CertificateRemoveRequest: any = [
    body("id").exists().trim().notEmpty().isMongoId().withMessage('Employee is required'),
    body("certificateId").exists().trim().notEmpty().isMongoId().withMessage('Certificate name is required')
];

export default CertificateRemoveRequest;