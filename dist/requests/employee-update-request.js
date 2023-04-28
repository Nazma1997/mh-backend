"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const user_service_1 = require("../services/user-service");
//Validate input for mandatory fields
const EmployeeUpdateRequest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, express_validator_1.body)("id").exists().trim().isMongoId().withMessage('Employee is required').run(req);
    yield (0, express_validator_1.body)("firstName").exists().trim().notEmpty().isString().withMessage('Please enter your first name!').run(req);
    yield (0, express_validator_1.body)("lastName").exists().trim().notEmpty().isString().withMessage('Please enter your last name!').run(req);
    yield (0, express_validator_1.body)("gender").optional().notEmpty().isString().withMessage('Please enter your gender!').run(req);
    yield (0, express_validator_1.body)("dateOfBirth").optional().notEmpty().isDate().withMessage('Please enter your date of birth!').run(req);
    yield (0, express_validator_1.body)("email").exists().trim().notEmpty().isEmail().withMessage('Please enter a valid email address!').custom((value, { req }) => {
        return (0, user_service_1.emailAlreadyIsNotExists)(req.body.email, req.body.id);
    }).run(req);
    yield (0, express_validator_1.body)("phoneNumber").exists().trim().notEmpty().isString().withMessage('Please enter a valid phone number!').custom((value, { req }) => {
        return (0, user_service_1.phoneNumberAlreadyIsNotExists)(req.body.phoneNumber, req.body.id);
    }).run(req);
    yield (0, express_validator_1.body)("countryName").optional().notEmpty().isString().withMessage('Please enter your country name!').run(req);
    yield (0, express_validator_1.body)("presentAddress").optional().notEmpty().isString().withMessage('Please enter your present address!').run(req);
    yield (0, express_validator_1.body)("permanentAddress").optional().notEmpty().isString().withMessage('Please enter your permanent address!').run(req);
    yield (0, express_validator_1.body)("languages").exists().notEmpty().isArray().withMessage('Please enter your language!').run(req);
    yield (0, express_validator_1.body)("higherEducation").optional().notEmpty().isString().withMessage('Please enter your higher education!').run(req);
    yield (0, express_validator_1.body)("licensesNo").optional().notEmpty().isString().withMessage('Please enter your licenses no!').run(req);
    yield (0, express_validator_1.body)("emmergencyContact").optional().notEmpty().isString().withMessage('Please enter your emmergency contact!').run(req);
    yield (0, express_validator_1.body)("skills").optional().notEmpty().isArray().withMessage('Please enter your skills!').run(req);
    yield (0, express_validator_1.body)("positionId").exists().trim().notEmpty().isMongoId().withMessage('Please enter your position!').run(req);
    yield (0, express_validator_1.body)("sourceId").optional().notEmpty().isMongoId().withMessage('Please enter source!').run(req);
    yield (0, express_validator_1.body)("referPersonId").optional().notEmpty().isMongoId().withMessage('Please enter refer person name!').run(req);
    yield (0, express_validator_1.body)("employeeExperience").optional().notEmpty().isString().withMessage('Please enter experience!').run(req);
    yield (0, express_validator_1.body)("profilePicture").optional().trim().notEmpty().isString().withMessage('Please enter your profile picture!').run(req);
    yield (0, express_validator_1.body)("cv").optional().trim().notEmpty().isString().withMessage('Please enter your cv!').run(req);
    yield (0, express_validator_1.body)("hourlyRate").optional().trim().notEmpty().isString().withMessage('Please enter hourlyRate!').run(req);
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty())
        return result.array();
    return true;
});
exports.default = EmployeeUpdateRequest;
