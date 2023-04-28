import { body } from "express-validator";
import config from "config";

import { isPasswordValid } from "../helpers/validators/password-validator-helper";
import { emailAlreadyIsNotExists, phoneNumberAlreadyIsNotExists } from "../services/user-service";


const minPasswordLength = config.get<number>("PASSWORD_MIN_LENGTH");

//check mandatory fields
const MhEmployeeAddRequest: any = [
   body("name").exists().trim().notEmpty().isString().withMessage('Please enter employee name!'),
   body("email").exists().trim().notEmpty().isEmail().withMessage('Please enter a valid email address!').custom((value: string, { req }) => {
      return emailAlreadyIsNotExists(req.body.email);
   }),
   body("phoneNumber").exists().trim().notEmpty().isString().withMessage('Please enter a valid phone number!').custom((value: string, { req }) => {
      return phoneNumberAlreadyIsNotExists(req.body.phoneNumber);
   }),
   body("password").exists().trim().notEmpty().isString().isLength({ min: minPasswordLength }).withMessage(`Password must be required and contain minimum ${minPasswordLength} characters!`).custom((value: string, { req }) => {
      return isPasswordValid(req.body.password);
   }),
   body("role").exists().trim().notEmpty().isString().withMessage('Please enter role name!'),
   body("permissions").exists().notEmpty().isArray().withMessage('Please enter permission!'),
   body("active").exists().notEmpty().isBoolean().withMessage('Please enter status!'),
];
export default  MhEmployeeAddRequest;