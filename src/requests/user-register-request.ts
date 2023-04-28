import { body, validationResult } from "express-validator";
import config from "config";

import { isPasswordValid } from "../helpers/validators/password-validator-helper";
import { emailAlreadyIsNotExists, phoneNumberAlreadyIsNotExists } from "../services/user-service";


const minPasswordLength = config.get<number>("PASSWORD_MIN_LENGTH");

//check mandatory fields
const ClientRegisterRequest: any = [
   body("restaurantName").exists().trim().notEmpty().isString().withMessage('Please enter your restaurant name!'),
   body("restaurantAddress").exists().trim().notEmpty().isString().withMessage('Please enter your restaurant address!'),
   body("sourceId").optional().trim().notEmpty().isMongoId().withMessage('Please enter source!'),
   body("referPersonId").optional().trim().notEmpty().isMongoId().withMessage('Please enter refer person name!'),
   body("email").exists().trim().notEmpty().isEmail().withMessage('Please enter a valid email address!').custom((value: string, { req }) => {
      return emailAlreadyIsNotExists(req.body.email);
   }),
   body("phoneNumber").exists().trim().notEmpty().isString().withMessage('Please enter a valid phone number!').custom((value: string, { req }) => {
      return phoneNumberAlreadyIsNotExists(req.body.phoneNumber);
   }),
   body("password").exists().trim().notEmpty().isString().isLength({ min: minPasswordLength }).withMessage(`Password must be required and contain minimum ${minPasswordLength} characters!`).custom((value: string, { req }) => {
      return isPasswordValid(req.body.password);
   }),
   body("lat").exists().trim().notEmpty().isString().withMessage('Please enter lat!'),
   body("long").exists().trim().notEmpty().isString().withMessage('Please enter long!'),
];

const EmployeeRegisterRequest: any = async (req: Request): Promise<any> => {
   await body("firstName").exists().trim().notEmpty().isString().withMessage('Please enter your first name!').run(req);
   await body("lastName").exists().trim().notEmpty().isString().withMessage('Please enter your last name!').run(req);
   await body("email").exists().trim().notEmpty().isEmail().withMessage('Please enter a valid email address!').custom((value: string, { req }) => {
      return emailAlreadyIsNotExists(req.body.email);
   }).run(req);
   await body("phoneNumber").exists().trim().notEmpty().isString().withMessage('Please enter a valid phone number!').custom((value: string, { req }) => {
      return phoneNumberAlreadyIsNotExists(req.body.phoneNumber);
   }).run(req);
   await body("countryName").exists().notEmpty().isString().withMessage('Please enter your location!').run(req);
   await body("positionId").exists().trim().notEmpty().isMongoId().withMessage('Please enter your job type!').run(req);
   await body("profilePicture").optional().trim().notEmpty().isString().withMessage('Please enter your profile picture!').run(req);
   await body("cv").optional().trim().notEmpty().isString().withMessage('Please enter your cv!').run(req);

   const result = validationResult(req);

   if (!result.isEmpty()) return result.array();

   return true;
};

export { ClientRegisterRequest, EmployeeRegisterRequest };