import { body, validationResult } from "express-validator";
import { emailAlreadyIsNotExists, phoneNumberAlreadyIsNotExists } from "../services/user-service";

//Validate input for mandatory fields
const EmployeeUpdateRequest: any = async (req: Request): Promise<any> => {
    await body("id").exists().trim().isMongoId().withMessage('Employee is required').run(req);
    await body("firstName").exists().trim().notEmpty().isString().withMessage('Please enter your first name!').run(req);
    await body("lastName").exists().trim().notEmpty().isString().withMessage('Please enter your last name!').run(req);
    await body("gender").optional().notEmpty().isString().withMessage('Please enter your gender!').run(req);
    await body("dateOfBirth").optional().notEmpty().isDate().withMessage('Please enter your date of birth!').run(req);
    await body("email").exists().trim().notEmpty().isEmail().withMessage('Please enter a valid email address!').custom((value: string, { req }) => {
        return emailAlreadyIsNotExists(req.body.email, req.body.id);
    }).run(req);
    await body("phoneNumber").exists().trim().notEmpty().isString().withMessage('Please enter a valid phone number!').custom((value: string, { req }) => {
        return phoneNumberAlreadyIsNotExists(req.body.phoneNumber, req.body.id);
    }).run(req);
    await body("countryName").optional().notEmpty().isString().withMessage('Please enter your country name!').run(req);
    await body("presentAddress").optional().notEmpty().isString().withMessage('Please enter your present address!').run(req);
    await body("permanentAddress").optional().notEmpty().isString().withMessage('Please enter your permanent address!').run(req);
    await body("languages").exists().notEmpty().isArray().withMessage('Please enter your language!').run(req);
    await body("higherEducation").optional().notEmpty().isString().withMessage('Please enter your higher education!').run(req);
    await body("licensesNo").optional().notEmpty().isString().withMessage('Please enter your licenses no!').run(req);
    await body("emmergencyContact").optional().notEmpty().isString().withMessage('Please enter your emmergency contact!').run(req);
    await body("skills").optional().notEmpty().isArray().withMessage('Please enter your skills!').run(req);
    await body("positionId").exists().trim().notEmpty().isMongoId().withMessage('Please enter your position!').run(req);
    await body("sourceId").optional().notEmpty().isMongoId().withMessage('Please enter source!').run(req);
    await body("referPersonId").optional().notEmpty().isMongoId().withMessage('Please enter refer person name!').run(req);
    await body("employeeExperience").optional().notEmpty().isString().withMessage('Please enter experience!').run(req);
    await body("profilePicture").optional().trim().notEmpty().isString().withMessage('Please enter your profile picture!').run(req);
    await body("cv").optional().trim().notEmpty().isString().withMessage('Please enter your cv!').run(req);
    await body("hourlyRate").optional().trim().notEmpty().isString().withMessage('Please enter hourlyRate!').run(req);

    const result = validationResult(req);

    if (!result.isEmpty()) return result.array();

    return true;
};

export default EmployeeUpdateRequest;