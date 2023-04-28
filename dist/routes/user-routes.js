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
const express_1 = __importDefault(require("@awaitjs/express"));
const auth_1 = require("../middleware/auth");
const user_controller_1 = require("../controllers/user-controller");
const validate_request_handler_1 = __importDefault(require("../middleware/validate-request-handler"));
const user_login_request_1 = __importDefault(require("../requests/user-login-request"));
const user_register_request_1 = require("../requests/user-register-request");
const user_update_request_1 = require("../requests/user-update-request");
const user_password_update_request_1 = require("../requests/user-password-update-request");
const user_forgot_password_request_1 = __importDefault(require("../requests/user-forgot-password-request"));
const user_reset_password_request_1 = __importDefault(require("../requests/user-reset-password-request"));
const user_refere_person_update_request_1 = __importDefault(require("../requests/user-refere-person-update-request"));
const user_profile_picture_request_1 = require("../requests/custom-field-request/user-profile-picture-request");
const user_certificate_request_1 = require("../requests/custom-field-request/user-certificate-request");
const bank_dress_update_request_1 = __importDefault(require("../requests/bank-dress-update-request"));
const mh_employee_add_register_request_1 = __importDefault(require("../requests/mh-employee-add-register-request"));
const mh_employee_update_request_1 = __importDefault(require("../requests/mh-employee-update-request"));
const client_discount_update_request_1 = __importDefault(require("../requests/client-discount-update-request"));
const certificate_remove_request_1 = __importDefault(require("../requests/certificate-remove-request"));
const push_notification_update_request_1 = __importDefault(require("../requests/push-notification-update-request"));
const user_register_request_2 = require("../requests/custom-field-request/user-register-request");
const upload_service_1 = require("../services/upload-service");
const setS3BucketType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    req.bucketType = "user_profile";
    next();
});
const userRouter = express_1.default.Router();
//Reader API
userRouter.getAsync("/", auth_1.authenticate, validate_request_handler_1.default, user_controller_1.getAll);
userRouter.getAsync("/list", validate_request_handler_1.default, user_controller_1.getAllPublic);
userRouter.getAsync("/list-for-dropdown", auth_1.authenticate, validate_request_handler_1.default, user_controller_1.getAllForDropDown);
userRouter.getAsync("/mh-employee-list", auth_1.authenticate, validate_request_handler_1.default, user_controller_1.getAllMhEmployee);
//User login
userRouter.postAsync("/login", user_login_request_1.default, validate_request_handler_1.default, user_controller_1.userLogin);
//Client and employee register
userRouter.postAsync("/client-register", user_register_request_1.ClientRegisterRequest, validate_request_handler_1.default, user_controller_1.registerClientUser);
userRouter.postAsync("/employee-register", setS3BucketType, upload_service_1.imageOrFileUpload.fields(user_register_request_2.UserRegisterRequest), validate_request_handler_1.default, user_controller_1.registerEmployeeUser);
userRouter.postAsync("/mh-employee-register", mh_employee_add_register_request_1.default, validate_request_handler_1.default, user_controller_1.registerMhEmployeeUser);
userRouter.putAsync("/mh-employee-update", mh_employee_update_request_1.default, validate_request_handler_1.default, user_controller_1.updateMhEmployeeUser);
//employee update
userRouter.putAsync("/update-employee", setS3BucketType, upload_service_1.imageOrFileUpload.fields(user_register_request_2.UserRegisterRequest), validate_request_handler_1.default, user_controller_1.updateEmployeeUser);
//Update user profile
userRouter.putAsync("/profile", auth_1.authenticate, user_update_request_1.UserUpdateRequest, validate_request_handler_1.default, user_controller_1.updateUserProfile);
userRouter.putAsync("/profile-picture/upload", setS3BucketType, upload_service_1.imageOrFileUpload.fields(user_profile_picture_request_1.UserProfilePictureRequest), validate_request_handler_1.default, user_controller_1.updateUserProfilePicture);
userRouter.putAsync("/certificate/upload", setS3BucketType, upload_service_1.imageOrFileUpload.fields(user_certificate_request_1.UserCertificateRequest), validate_request_handler_1.default, user_controller_1.updateCertificate);
userRouter.putAsync("/certificate/remove", certificate_remove_request_1.default, validate_request_handler_1.default, user_controller_1.removeCertificate);
//Bank and Dress
userRouter.putAsync("/update-bank-dress", auth_1.authenticate, bank_dress_update_request_1.default, validate_request_handler_1.default, user_controller_1.updateBankDress);
//Update user password
userRouter.putAsync("/update-password", auth_1.authenticate, user_password_update_request_1.UserPasswordUpdateRequest, validate_request_handler_1.default, user_controller_1.updateUserPassword);
userRouter.putAsync("/forgot-password", user_forgot_password_request_1.default, validate_request_handler_1.default, user_controller_1.userForgotPassword);
userRouter.putAsync("/reset-password", user_reset_password_request_1.default, validate_request_handler_1.default, user_controller_1.userResetPassword);
//Update user status
userRouter.putAsync("/update-status", auth_1.authenticate, user_update_request_1.UserUpdateStatusRequest, validate_request_handler_1.default, user_controller_1.userUpdateStatus);
//Referperson
userRouter.putAsync("/refer-person", auth_1.authenticate, user_refere_person_update_request_1.default, validate_request_handler_1.default, user_controller_1.userReferPersonUpdate);
//Client Discount set
userRouter.putAsync("/update-client-discount", auth_1.authenticate, client_discount_update_request_1.default, validate_request_handler_1.default, user_controller_1.clientDiscountUpdate);
//Removed user
userRouter.putAsync("/remove", auth_1.authenticate, validate_request_handler_1.default, user_controller_1.removeUser);
//push notification info update
userRouter.putAsync("/push-notification-update", auth_1.authenticate, push_notification_update_request_1.default, validate_request_handler_1.default, user_controller_1.updatePushNotification);
userRouter.getAsync("/:id", auth_1.authenticate, validate_request_handler_1.default, user_controller_1.getInfo);
exports.default = userRouter;
