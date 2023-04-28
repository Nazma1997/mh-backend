import { Request } from "express";
import { body, validationResult } from "express-validator";


//Validate input for mandatory fields
const UserCertificatesUploadRequest = async (req: Request): Promise<any> => {
    await body("id").exists().trim().notEmpty().isMongoId().withMessage('User is required!').run(req);
    await body("certificateId").optional().trim().notEmpty().isMongoId().withMessage('Certificate is required!').run(req);
    await body("certificateName").exists().trim().notEmpty().isString().withMessage('Certificate name is required!').run(req);
    await body("attachment").exists().trim().notEmpty().isString().withMessage('Certificate attachment is required!').run(req);

    const result = validationResult(req);

    if (!result.isEmpty()) return result.array();

    return true;
};

export default UserCertificatesUploadRequest;