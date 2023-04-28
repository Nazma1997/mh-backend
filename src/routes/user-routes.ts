import express from "@awaitjs/express";
import { Request, Response, NextFunction } from "express";

import { authenticate } from "../middleware/auth";

import {
    getAll,
    getAllPublic,
    getAllMhEmployee,
    getAllForDropDown,
    getInfo,
    registerClientUser,
    registerEmployeeUser,
    updateUserProfile,
    updateUserProfilePicture,
    updateCertificate,
    userLogin,
    updateUserPassword,
    userForgotPassword,
    userResetPassword,
    userUpdateStatus,
    removeUser,
    userReferPersonUpdate,
    updateBankDress,
    registerMhEmployeeUser,
    updateMhEmployeeUser,
    clientDiscountUpdate,
    updateEmployeeUser,
    removeCertificate,
    updatePushNotification
} from "../controllers/user-controller";

import ValidateRequestHandler from "../middleware/validate-request-handler";

import UserLoginRequest from "../requests/user-login-request";
import { ClientRegisterRequest } from "../requests/user-register-request";
import { UserUpdateRequest, UserUpdateStatusRequest } from "../requests/user-update-request";
import { UserPasswordUpdateRequest } from "../requests/user-password-update-request";
import UserForgotPasswordRequest from "../requests/user-forgot-password-request";
import UserResetPasswordRequest from "../requests/user-reset-password-request";
import UserReferPersonUpdateRequest from "../requests/user-refere-person-update-request";
import { UserProfilePictureRequest } from "../requests/custom-field-request/user-profile-picture-request";
import { UserCertificateRequest } from "../requests/custom-field-request/user-certificate-request";
import BankDressUpdateRequest from "../requests/bank-dress-update-request";
import MhEmployeeAddRequest from "../requests/mh-employee-add-register-request";
import MhEmployeeUpdateRequest from "../requests/mh-employee-update-request";
import ClientDiscountUpdateRequest from "../requests/client-discount-update-request";
import CertificateRemoveRequest from "../requests/certificate-remove-request";
import PushNotificationUpdateRequest from "../requests/push-notification-update-request";

import { UserRegisterRequest } from "../requests/custom-field-request/user-register-request";

import { imageOrFileUpload } from "../services/upload-service";

const setS3BucketType = async (req: Request, res: Response, next: NextFunction) => {

    //@ts-ignore
    req.bucketType = "user_profile";

    next();
};

const userRouter = express.Router();

//Reader API
userRouter.getAsync("/", authenticate, ValidateRequestHandler, getAll);
userRouter.getAsync("/list", ValidateRequestHandler, getAllPublic);
userRouter.getAsync("/list-for-dropdown", authenticate, ValidateRequestHandler, getAllForDropDown);
userRouter.getAsync("/mh-employee-list", authenticate, ValidateRequestHandler, getAllMhEmployee);

//User login
userRouter.postAsync("/login", UserLoginRequest, ValidateRequestHandler, userLogin);

//Client and employee register
userRouter.postAsync("/client-register", ClientRegisterRequest, ValidateRequestHandler, registerClientUser);
userRouter.postAsync("/employee-register", setS3BucketType, imageOrFileUpload.fields(UserRegisterRequest), ValidateRequestHandler, registerEmployeeUser);
userRouter.postAsync("/mh-employee-register", MhEmployeeAddRequest, ValidateRequestHandler, registerMhEmployeeUser);
userRouter.putAsync("/mh-employee-update", MhEmployeeUpdateRequest, ValidateRequestHandler, updateMhEmployeeUser);

//employee update
userRouter.putAsync("/update-employee", setS3BucketType, imageOrFileUpload.fields(UserRegisterRequest), ValidateRequestHandler, updateEmployeeUser);

//Update user profile
userRouter.putAsync("/profile", authenticate, UserUpdateRequest, ValidateRequestHandler, updateUserProfile);

userRouter.putAsync("/profile-picture/upload", setS3BucketType, imageOrFileUpload.fields(UserProfilePictureRequest), ValidateRequestHandler, updateUserProfilePicture);
userRouter.putAsync("/certificate/upload", setS3BucketType, imageOrFileUpload.fields(UserCertificateRequest), ValidateRequestHandler, updateCertificate);
userRouter.putAsync("/certificate/remove", CertificateRemoveRequest, ValidateRequestHandler, removeCertificate);

//Bank and Dress
userRouter.putAsync("/update-bank-dress", authenticate, BankDressUpdateRequest, ValidateRequestHandler, updateBankDress);

//Update user password
userRouter.putAsync("/update-password", authenticate, UserPasswordUpdateRequest, ValidateRequestHandler, updateUserPassword);
userRouter.putAsync("/forgot-password", UserForgotPasswordRequest, ValidateRequestHandler, userForgotPassword);
userRouter.putAsync("/reset-password", UserResetPasswordRequest, ValidateRequestHandler, userResetPassword);

//Update user status
userRouter.putAsync("/update-status", authenticate, UserUpdateStatusRequest, ValidateRequestHandler, userUpdateStatus);

//Referperson
userRouter.putAsync("/refer-person", authenticate, UserReferPersonUpdateRequest, ValidateRequestHandler, userReferPersonUpdate);

//Client Discount set
userRouter.putAsync("/update-client-discount", authenticate, ClientDiscountUpdateRequest, ValidateRequestHandler, clientDiscountUpdate);

//Removed user
userRouter.putAsync("/remove", authenticate, ValidateRequestHandler, removeUser);

//push notification info update
userRouter.putAsync("/push-notification-update", authenticate, PushNotificationUpdateRequest, ValidateRequestHandler, updatePushNotification);

userRouter.getAsync("/:id", authenticate, ValidateRequestHandler, getInfo);

export default userRouter; 