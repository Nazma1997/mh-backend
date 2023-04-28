import { body } from "express-validator";
import config from "config";

import { isCurrentPassword, isPasswordValid } from "../helpers/validators/password-validator-helper";

const minPasswordLength = config.get<number>("PASSWORD_MIN_LENGTH");

//Validate input for mandatory fields
const UserPasswordUpdateRequest: any = [
    body("id").exists().trim().notEmpty().isMongoId().withMessage("User is required!"),
    body("newPassword").exists().trim().notEmpty().isString().isLength({ min: minPasswordLength }).withMessage(`Password must contain minimum ${minPasswordLength} characters!`).custom((value: string, { req }) => {
        return isPasswordValid(req.body.newPassword);
    }),
    body("currentPassword").exists().trim().notEmpty().isString().isLength({ min: minPasswordLength }).withMessage(`Password must contain minimum ${minPasswordLength} characters!`).custom((value: string, { req }) => {
        return isCurrentPassword(req.body.id, req.body.currentPassword);
    })
];

//Validate input for mandatory fields
const SubUserPasswordUpdateRequest: any = [
    body("id").exists().trim().notEmpty().isMongoId().withMessage("User id is required!"),
    body("newPassword").exists().trim().notEmpty().isString().isLength({ min: minPasswordLength }).withMessage(`Password must contain minimum ${minPasswordLength} characters!`).custom((value: string, { req }) => {
        return isPasswordValid(req.body.newPassword);
    }),
];

export { UserPasswordUpdateRequest, SubUserPasswordUpdateRequest };