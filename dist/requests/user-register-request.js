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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRegisterRequest = exports.ClientRegisterRequest = void 0;
const express_validator_1 = require("express-validator");
const config_1 = __importDefault(require("config"));
const password_validator_helper_1 = require("../helpers/validators/password-validator-helper");
const user_service_1 = require("../services/user-service");
const minPasswordLength = config_1.default.get("PASSWORD_MIN_LENGTH");
//check mandatory fields
const ClientRegisterRequest = [
    (0, express_validator_1.body)("restaurantName").exists().trim().notEmpty().isString().withMessage('Please enter your restaurant name!'),
    (0, express_validator_1.body)("restaurantAddress").exists().trim().notEmpty().isString().withMessage('Please enter your restaurant address!'),
    (0, express_validator_1.body)("sourceId").optional().trim().notEmpty().isMongoId().withMessage('Please enter source!'),
    (0, express_validator_1.body)("referPersonId").optional().trim().notEmpty().isMongoId().withMessage('Please enter refer person name!'),
    (0, express_validator_1.body)("email").exists().trim().notEmpty().isEmail().withMessage('Please enter a valid email address!').custom((value, { req }) => {
        return (0, user_service_1.emailAlreadyIsNotExists)(req.body.email);
    }),
    (0, express_validator_1.body)("phoneNumber").exists().trim().notEmpty().isString().withMessage('Please enter a valid phone number!').custom((value, { req }) => {
        return (0, user_service_1.phoneNumberAlreadyIsNotExists)(req.body.phoneNumber);
    }),
    (0, express_validator_1.body)("password").exists().trim().notEmpty().isString().isLength({ min: minPasswordLength }).withMessage(`Password must be required and contain minimum ${minPasswordLength} characters!`).custom((value, { req }) => {
        return (0, password_validator_helper_1.isPasswordValid)(req.body.password);
    }),
    (0, express_validator_1.body)("lat").exists().trim().notEmpty().isString().withMessage('Please enter lat!'),
    (0, express_validator_1.body)("long").exists().trim().notEmpty().isString().withMessage('Please enter long!'),
];
exports.ClientRegisterRequest = ClientRegisterRequest;
const EmployeeRegisterRequest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, express_validator_1.body)("firstName").exists().trim().notEmpty().isString().withMessage('Please enter your first name!').run(req);
    yield (0, express_validator_1.body)("lastName").exists().trim().notEmpty().isString().withMessage('Please enter your last name!').run(req);
    yield (0, express_validator_1.body)("email").exists().trim().notEmpty().isEmail().withMessage('Please enter a valid email address!').custom((value, { req }) => {
        return (0, user_service_1.emailAlreadyIsNotExists)(req.body.email);
    }).run(req);
    yield (0, express_validator_1.body)("phoneNumber").exists().trim().notEmpty().isString().withMessage('Please enter a valid phone number!').custom((value, { req }) => {
        return (0, user_service_1.phoneNumberAlreadyIsNotExists)(req.body.phoneNumber);
    }).run(req);
    yield (0, express_validator_1.body)("countryName").exists().notEmpty().isString().withMessage('Please enter your location!').run(req);
    yield (0, express_validator_1.body)("positionId").exists().trim().notEmpty().isMongoId().withMessage('Please enter your job type!').run(req);
    yield (0, express_validator_1.body)("profilePicture").optional().trim().notEmpty().isString().withMessage('Please enter your profile picture!').run(req);
    yield (0, express_validator_1.body)("cv").optional().trim().notEmpty().isString().withMessage('Please enter your cv!').run(req);
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty())
        return result.array();
    return true;
});
exports.EmployeeRegisterRequest = EmployeeRegisterRequest;
