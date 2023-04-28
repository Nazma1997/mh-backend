import { Request } from "express";
import { body, validationResult } from "express-validator";


//Validate input for mandatory fields
const UserProfilePicturesUploadRequest = async (req: Request): Promise<any> => {
    await body("id").exists().trim().notEmpty().isMongoId().withMessage('User is required!').run(req);
    await body("profilePicture").exists().trim().notEmpty().isString().withMessage('User profile is required!').run(req);
    await body("cv").optional().trim().notEmpty().isString().withMessage('User cv is required!').run(req);

    const result = validationResult(req);

    if (!result.isEmpty()) return result.array();

    return true;
};

export default UserProfilePicturesUploadRequest;