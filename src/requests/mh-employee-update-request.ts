import { body } from "express-validator";
import config from "config";

import { isPasswordValid } from "../helpers/validators/password-validator-helper";
import { emailAlreadyIsNotExists, phoneNumberAlreadyIsNotExists } from "../services/user-service";


const minPasswordLength = config.get<number>("PASSWORD_MIN_LENGTH");

//check mandatory fields
const MhEmployeeUpdateRequest: any = [
   body("id").exists().trim().isMongoId().withMessage('Employee is required'),
   body("name").exists().trim().notEmpty().isString().withMessage('Please enter employee name!'),
   body("email").exists().trim().notEmpty().isEmail().withMessage('Please enter a valid email address!').custom((value: string, { req }) => {
      return emailAlreadyIsNotExists(req.body.email, req.body.id);
   }),
   body("phoneNumber").exists().trim().notEmpty().isString().withMessage('Please enter a valid phone number!').custom((value: string, { req }) => {
      return phoneNumberAlreadyIsNotExists(req.body.phoneNumber, req.body.id);
   }),
   body("role").exists().trim().notEmpty().isString().withMessage('Please enter role name!'),
   body("permissions").exists().notEmpty().isArray().withMessage('Please enter permission!'),
   body("active").exists().notEmpty().isBoolean().withMessage('Please enter status!'),
];
export default MhEmployeeUpdateRequest;