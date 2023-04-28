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
exports.removeCertificate = exports.updateUserProfile = exports.removeUser = exports.updateBankDress = exports.clientDiscountUpdate = exports.userReferPersonUpdate = exports.userUpdateStatus = exports.userResetPassword = exports.userForgotPassword = exports.updateUserPassword = exports.updateUserPhoneNumber = exports.updateUserEmail = exports.userLogin = exports.updateCertificate = exports.updateUserProfilePicture = exports.updateMhEmployeeUser = exports.updatePushNotification = exports.registerMhEmployeeUser = exports.updateEmployeeUser = exports.registerEmployeeUser = exports.registerClientUser = exports.getAllForDropDown = exports.getInfo = exports.getAllMhEmployee = exports.getAllPublic = exports.getAll = void 0;
const config_1 = __importDefault(require("config"));
const lodash_1 = __importDefault(require("lodash"));
const success_response_handler_1 = require("../middleware/success-response-handler");
const user_profile_update_request_1 = __importDefault(require("../requests/user-profile-update-request"));
const user_service_1 = require("../services/user-service");
const email_notification_service_1 = require("../services/email-notification-service");
const file_mapping_helper_1 = require("../helpers/file-mapping-helper");
const aws_s3_service_1 = require("../services/aws-s3-service");
const user_certificate_update_request_1 = __importDefault(require("../requests/user-certificate-update-request"));
const user_register_request_1 = require("../requests/user-register-request");
const employee_update_request_1 = __importDefault(require("../requests/employee-update-request"));
//pass the client valid inputs to service
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_service_1.getUserList)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "User list fetch successfully!", null, user);
    }
    catch (err) {
        return next(err);
    }
});
exports.getAll = getAll;
//pass to the valid request to service
const getAllPublic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.query.viewType = "public";
        const user = yield (0, user_service_1.getUserList)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "User list fetch successfully!", null, user);
    }
    catch (err) {
        return next(err);
    }
});
exports.getAllPublic = getAllPublic;
//pass to the valid request to service
const getAllMhEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_service_1.getMhEmployeeUserList)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "User list fetch successfully!", null, user);
    }
    catch (err) {
        return next(err);
    }
});
exports.getAllMhEmployee = getAllMhEmployee;
//pass the client valid inputs to service
const getInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield (0, user_service_1.getUserInfoById)(id);
        const userInfo = lodash_1.default.pick(user, [
            "_id", "firstName", "lastName", "name", "positionId", "positionName", "gender", "dateOfBirth", "userIdNumber", "email", "phoneNumber",
            "bankName", "accountNumber", "routingNumber", "dressSize", "additionalOne", "additionalTwo", "presentAddress", "permanentAddress",
            "languages", "higherEducation", "licensesNo", "certificates", "emmergencyContact", "skill", "countryName", "countryCode",
            "sourceId", "sourceName", "referPersonId", "referPersonName", "restaurantName", "restaurantAddress", "nidNumber", "passportNumber",
            "employee", "client", "admin", "hr", "marketing", "role", "isReferPerson", "isMhEmployee", "isHired", "hiredFromDate", "hiredToDate",
            "hiredBy", "hiredByLat", "hiredByLong", "hiredByRestaurantName", "hiredByRestaurantAddress", "deactivatedReason", "position",
            "profileCompleted", "profilePicture", "cv", "verified", "active", "employeeExperience", "rating", "totalWorkingHour",
            "hourlyRate", "clientDiscount", "hiredBy", "lat", "long",
        ]);
        const menuPermission = [];
        if (user && user.menuPermission && user.menuPermission.position)
            menuPermission.push("POSITION");
        if (user && user.menuPermission && user.menuPermission.skill)
            menuPermission.push("SKILL");
        if (user && user.menuPermission && user.menuPermission.source)
            menuPermission.push("SOURCE");
        if (user && user.menuPermission && user.menuPermission.employeeList)
            menuPermission.push("EMPLOYEE_LIST");
        if (user && user.menuPermission && user.menuPermission.clientList)
            menuPermission.push("CLIENT_LIST");
        if (user && user.menuPermission && user.menuPermission.clientEmployeeList)
            menuPermission.push("CLIENT_EMPLOYEE_LIST");
        if (user && user.menuPermission && user.menuPermission.mhEmployeeList)
            menuPermission.push("MH_EMPLOYEE_LIST");
        if (user && user.menuPermission && user.menuPermission.addMhEmployee)
            menuPermission.push("ADD_MH_EMPLOYEE");
        userInfo.menuPermission = lodash_1.default.uniq(menuPermission);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "User info fetch successfully!", "details", userInfo);
    }
    catch (err) {
        return next(err);
    }
});
exports.getInfo = getInfo;
//pass the client valid inputs to service
const getAllForDropDown = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_service_1.getUserListForDropDown)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "User list fetch successfully!", null, user);
    }
    catch (err) {
        return next(err);
    }
});
exports.getAllForDropDown = getAllForDropDown;
//pass the client valid inputs to service
const registerClientUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = lodash_1.default.pick(req.body, ["restaurantName", "restaurantAddress", "email", "phoneNumber", "password", "sourceId", "referPersonId", "lat", "long"]);
        req.body.active = false;
        req.body.client = true;
        req.body.role = "CLIENT";
        const user = yield (0, user_service_1.createUser)(req);
        const token = yield (0, user_service_1.getToken)(user);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 201, "Client has been registered successfully!", "token", token);
    }
    catch (err) {
        return next(err);
    }
});
exports.registerClientUser = registerClientUser;
//pass the employee valid inputs to service
const registerEmployeeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.s3BucketUrl = config_1.default.get("USER_PROFILE_DOC_S3_BUCKET_URL");
        //Take the location from uploaded files and assign them dynamically to request body
        yield (0, file_mapping_helper_1.filesMappingHelper)(req);
        //Validation check for mandatory fields
        const checkMandatoryFields = yield (0, user_register_request_1.EmployeeRegisterRequest)(req);
        if (checkMandatoryFields !== true) {
            if (lodash_1.default.size(req.body.unlinkArray))
                yield (0, aws_s3_service_1.multipleImageOrFileUnlink)(req.body.unlinkArray);
            let customError = new Error(checkMandatoryFields[0].msg);
            customError.statusCode = 400;
            throw customError;
        }
        req.body = lodash_1.default.pick(req.body, ["firstName", "lastName", "email", "phoneNumber", "countryName", "positionId", "profilePicture", "cv", "unlinkArray", "s3BucketUrl"]);
        req.body.employee = true;
        req.body.active = false;
        req.body.role = "EMPLOYEE";
        const user = yield (0, user_service_1.createUser)(req);
        const token = yield (0, user_service_1.getToken)(user);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 201, "Employee has been registered successfully!", "details", { _id: user._id });
    }
    catch (err) {
        return next(err);
    }
});
exports.registerEmployeeUser = registerEmployeeUser;
//pass the employee valid inputs to service
const updateEmployeeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.s3BucketUrl = config_1.default.get("USER_PROFILE_DOC_S3_BUCKET_URL");
        //Take the location from uploaded files and assign them dynamically to request body
        yield (0, file_mapping_helper_1.filesMappingHelper)(req);
        //Validation check for mandatory fields
        const checkMandatoryFields = yield (0, employee_update_request_1.default)(req);
        if (checkMandatoryFields !== true) {
            if (lodash_1.default.size(req.body.unlinkArray))
                yield (0, aws_s3_service_1.multipleImageOrFileUnlink)(req.body.unlinkArray);
            let customError = new Error(checkMandatoryFields[0].msg);
            customError.statusCode = 400;
            throw customError;
        }
        req.body = lodash_1.default.pick(req.body, ["id", "firstName", "lastName", "gender", "dateOfBirth", "email", "phoneNumber", "countryName", "presentAddress",
            "permanentAddress", "languages", "higherEducation", "licensesNo", "emmergencyContact", "skills", "positionId",
            "sourceId", "referPersonId", "employeeExperience", "profilePicture", "cv", "hourlyRate",]);
        const user = yield (0, user_service_1.updateUser)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Employee has been updated successfully!");
    }
    catch (err) {
        console.log("err: ", err);
        return next(err);
    }
});
exports.updateEmployeeUser = updateEmployeeUser;
//pass the employee valid inputs to service
const registerMhEmployeeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = lodash_1.default.pick(req.body, ["name", "email", "phoneNumber", "password", "role", "active", "permissions"]);
        req.body.isMhEmployee = true;
        const user = yield (0, user_service_1.createMhUser)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 201, "Employee has been registered successfully!");
    }
    catch (err) {
        return next(err);
    }
});
exports.registerMhEmployeeUser = registerMhEmployeeUser;
//pass the employee valid inputs to service
const updatePushNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = lodash_1.default.pick(req.body, ["uuid", "fcmToken", "platform"]);
        const user = yield (0, user_service_1.updateUserPushNotificationInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 201, "Push notification has been updated successfully!");
    }
    catch (err) {
        return next(err);
    }
});
exports.updatePushNotification = updatePushNotification;
//pass the employee valid inputs to service
const updateMhEmployeeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = lodash_1.default.pick(req.body, ["id", "name", "email", "phoneNumber", "role", "active", "permissions"]);
        const user = yield (0, user_service_1.updateMhUser)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 201, "Employee has been registered successfully!");
    }
    catch (err) {
        return next(err);
    }
});
exports.updateMhEmployeeUser = updateMhEmployeeUser;
const updateUserProfilePicture = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.s3BucketUrl = config_1.default.get("USER_PROFILE_DOC_S3_BUCKET_URL");
        //Take the location from uploaded files and assign them dynamically to request body
        yield (0, file_mapping_helper_1.filesMappingHelper)(req);
        //Validation check for mandatory fields
        const checkMandatoryFields = yield (0, user_profile_update_request_1.default)(req);
        if (checkMandatoryFields !== true) {
            if (lodash_1.default.size(req.body.unlinkArray))
                yield (0, aws_s3_service_1.multipleImageOrFileUnlink)(req.body.unlinkArray);
            let customError = new Error(checkMandatoryFields[0].msg);
            customError.statusCode = 400;
            throw customError;
        }
        req.body = lodash_1.default.pick(req.body, ["id", "profilePicture", "cv", "unlinkArray", "s3BucketUrl"]);
        const user = yield (0, user_service_1.updateUser)(req);
        const token = yield (0, user_service_1.getToken)(user);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Profile picture updated successfully!", "token", token);
    }
    catch (err) {
        return next(err);
    }
});
exports.updateUserProfilePicture = updateUserProfilePicture;
const updateCertificate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.s3BucketUrl = config_1.default.get("USER_PROFILE_DOC_S3_BUCKET_URL");
        //Take the location from uploaded files and assign them dynamically to request body
        yield (0, file_mapping_helper_1.filesMappingHelper)(req);
        //Validation check for mandatory fields
        const checkMandatoryFields = yield (0, user_certificate_update_request_1.default)(req);
        if (checkMandatoryFields !== true) {
            if (lodash_1.default.size(req.body.unlinkArray))
                yield (0, aws_s3_service_1.multipleImageOrFileUnlink)(req.body.unlinkArray);
            let customError = new Error(checkMandatoryFields[0].msg);
            customError.statusCode = 400;
            throw customError;
        }
        req.body = lodash_1.default.pick(req.body, ["id", "certificateId", "certificateName", "attachment", "unlinkArray", "s3BucketUrl"]);
        const user = yield (0, user_service_1.updateUserCertificateInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Certificate updated successfully!");
    }
    catch (err) {
        return next(err);
    }
});
exports.updateCertificate = updateCertificate;
//Passing email/phone number and password
//Generate user token and return to client
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = lodash_1.default.pick(req.body, ["email", "phoneNumber", "password"]);
        const token = yield (0, user_service_1.login)(req.body);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Login is successfully!", "token", token);
    }
    catch (err) {
        return next(err);
    }
});
exports.userLogin = userLogin;
//only id and email is passed to service after password checking
const updateUserEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const loggedInUserInfo = req.user;
        if (loggedInUserInfo._id.toString() !== req.body.id)
            throw new Error("Users are only allowed to change their own Email");
        // await verifyOtp(req.body.otpNumberForEmail, null, req.body.email, "email_update", "email");
        req.body = { id: req.body.id, email: req.body.email };
        const user = yield (0, user_service_1.updateUser)(req);
        if (!user)
            throw Error('Existing Email is inserted');
        const token = yield (0, user_service_1.getToken)(user);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "User email updated successfully!", "token", token);
    }
    catch (err) {
        return next(err);
    }
});
exports.updateUserEmail = updateUserEmail;
//only id and phoneNumber is passed to service after password checking
const updateUserPhoneNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const loggedInUserInfo = req.user;
        if (loggedInUserInfo._id.toString() !== req.body.id)
            throw new Error("Users are only allowed to change their own phone number");
        // await verifyOtp(req.body.otpNumberForPhone, req.body.phoneNumber, null, "phone_update", "phone");
        req.body = { id: req.body.id, phoneNumber: req.body.phoneNumber, countryCodeForPhone: req.body.countryCode };
        const user = yield (0, user_service_1.updateUser)(req);
        if (!user)
            throw Error('Existing Phone is inserted');
        const token = yield (0, user_service_1.getToken)(user);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "User phone number updated successfully!", "token", token);
    }
    catch (err) {
        return next(err);
    }
});
exports.updateUserPhoneNumber = updateUserPhoneNumber;
//only id and password is passed to service after password checking
const updateUserPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = { id: req.body.id, password: req.body.newPassword };
        const user = yield (0, user_service_1.updateUser)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "User password updated successfully!");
    }
    catch (err) {
        return next(err);
    }
});
exports.updateUserPassword = updateUserPassword;
//request is passed to service for sending otp
const userForgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = { email: req.body.email, phoneNumber: req.body.phoneNumber };
        const otp = yield (0, user_service_1.forgotPassword)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "We have sent 2 OTP's. Please check your email and phone!");
    }
    catch (err) {
        return next(err);
    }
});
exports.userForgotPassword = userForgotPassword;
//request is passed to service for otp checking and updating password
const userResetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = lodash_1.default.clone(req.body);
        req.body = lodash_1.default.pick(body, ["email", "phoneNumber", "password", "confirmPassword", "otpNumber"]);
        const user = yield (0, user_service_1.resetPassword)(req);
        req.body = { action: 'reset-password', name: user.name, email: user.email, otp: body.otpNumber, otpType: "password-change-confirmation", login: config_1.default.get("FRONT_END_LOGIN_URL"), subject: config_1.default.get("APPLICATION_SHORT_NAME") + " Password Reset" };
        const sentEmail = yield (0, email_notification_service_1.addEmailNotificationInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Your password has been updated successfully! Please login again!");
    }
    catch (err) {
        return next(err);
    }
});
exports.userResetPassword = userResetPassword;
//request is passed to service for updating active status
const userUpdateStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = { id: req.body.id, active: req.body.active };
        const user = yield (0, user_service_1.updateUser)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "User info has been updated successfully");
    }
    catch (err) {
        return next(err);
    }
});
exports.userUpdateStatus = userUpdateStatus;
//request is passed to service for updating refer person status
const userReferPersonUpdate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = { id: req.body.id, isReferPerson: req.body.isReferPerson };
        const user = yield (0, user_service_1.updateUser)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Refer person info has been updated successfully");
    }
    catch (err) {
        return next(err);
    }
});
exports.userReferPersonUpdate = userReferPersonUpdate;
//request is passed to service for updating client discount
const clientDiscountUpdate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = { id: req.body.id, clientDiscount: req.body.clientDiscount };
        const user = yield (0, user_service_1.updateUser)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Client discount has been updated successfully");
    }
    catch (err) {
        return next(err);
    }
});
exports.clientDiscountUpdate = clientDiscountUpdate;
//request is passed to service for updating refer person status
const updateBankDress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = lodash_1.default.pick(req.body, ["id", "bankName", "accountNumber", "routingNumber", "dressSize", "additionalOne", "additionalTwo"]);
        const user = yield (0, user_service_1.updateUser)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Bank and dress info has been updated successfully");
    }
    catch (err) {
        return next(err);
    }
});
exports.updateBankDress = updateBankDress;
//
//request is passed to service for updating user active/deleted with related info
const removeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_service_1.removeUserInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Your account has been deleted successfully");
    }
    catch (err) {
        return next(err);
    }
});
exports.removeUser = removeUser;
//Passing id and inputs to user service
const updateUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = lodash_1.default.pick(req.body, ["id", "nidNumber", "passportNumber"]);
        req.body.verified = true;
        req.body.basicCompleted = true;
        const user = yield (0, user_service_1.updateUser)(req);
        // if (user && !user.subUser) await addUserInDefaultRole(req);
        const token = yield (0, user_service_1.getToken)(user);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "User profile updated successfully!", "token", token);
    }
    catch (err) {
        return next(err);
    }
});
exports.updateUserProfile = updateUserProfile;
//Passing id and inputs to user service
const removeCertificate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = lodash_1.default.pick(req.body, ["id", "certificateId"]);
        const user = yield (0, user_service_1.removeEmployeeCertificateInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Certificate remove successfully!!");
    }
    catch (err) {
        return next(err);
    }
});
exports.removeCertificate = removeCertificate;
