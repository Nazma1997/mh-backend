import { NextFunction, Request, Response } from "express";

import config from "config";
import _ from "lodash";
const { sendMailWithNodeMailer } = require("../utils/sendMail/sendMail");

import { successResponseHandler } from "../middleware/success-response-handler";
import UserProfilePicturesUploadRequest from "../requests/user-profile-update-request";

import {
  createMhUser,
  createUser,
  forgotPassword,
  getMhEmployeeUserList,
  getToken,
  getUserInfoById,
  getUserList,
  getUserListForDropDown,
  login,
  removeEmployeeCertificateInfo,
  removeUserInfo,
  resetPassword,
  updateMhUser,
  updateUser,
  updateUserCertificateInfo,
  updateUserPushNotificationInfo,
} from "../services/user-service";

import { filesMappingHelper } from "../helpers/file-mapping-helper";
import EmployeeUpdateRequest from "../requests/employee-update-request";
import UserCertificatesUploadRequest from "../requests/user-certificate-update-request";
import { EmployeeRegisterRequest } from "../requests/user-register-request";
import { multipleImageOrFileUnlink } from "../services/aws-s3-service";
import { addEmailNotificationInfo } from "../services/email-notification-service";

//pass the client valid inputs to service
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user: any = await getUserList(req);

    return await successResponseHandler(
      res,
      200,
      "User list fetch successfully!",
      null,
      user
    );
  } catch (err) {
    return next(err);
  }
};

//pass to the valid request to service
export const getAllPublic = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    req.query.viewType = "public";

    const user: any = await getUserList(req);

    return await successResponseHandler(
      res,
      200,
      "User list fetch successfully!",
      null,
      user
    );
  } catch (err) {
    return next(err);
  }
};

//pass to the valid request to service
export const getAllMhEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user: any = await getMhEmployeeUserList(req);

    return await successResponseHandler(
      res,
      200,
      "User list fetch successfully!",
      null,
      user
    );
  } catch (err) {
    return next(err);
  }
};

//pass the client valid inputs to service
export const getInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const id: any = req.params.id;

    const user: any = await getUserInfoById(id);

    const userInfo: any = _.pick(user, [
      "_id",
      "firstName",
      "lastName",
      "name",
      "positionId",
      "positionName",
      "gender",
      "dateOfBirth",
      "userIdNumber",
      "email",
      "phoneNumber",
      "bankName",
      "accountNumber",
      "routingNumber",
      "dressSize",
      "additionalOne",
      "additionalTwo",
      "presentAddress",
      "permanentAddress",
      "languages",
      "higherEducation",
      "licensesNo",
      "certificates",
      "emmergencyContact",
      "skill",
      "countryName",
      "countryCode",
      "sourceId",
      "sourceName",
      "referPersonId",
      "referPersonName",
      "restaurantName",
      "restaurantAddress",
      "nidNumber",
      "passportNumber",
      "employee",
      "client",
      "admin",
      "hr",
      "marketing",
      "role",
      "isReferPerson",
      "isMhEmployee",
      "isHired",
      "hiredFromDate",
      "hiredToDate",
      "hiredBy",
      "hiredByLat",
      "hiredByLong",
      "hiredByRestaurantName",
      "hiredByRestaurantAddress",
      "deactivatedReason",
      "position",
      "profileCompleted",
      "profilePicture",
      "cv",
      "verified",
      "active",
      "employeeExperience",
      "rating",
      "totalWorkingHour",
      "hourlyRate",
      "clientDiscount",
      "hiredBy",
      "lat",
      "long",
    ]);

    const menuPermission: any = [];

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

    userInfo.menuPermission = _.uniq(menuPermission);

    return await successResponseHandler(
      res,
      200,
      "User info fetch successfully!",
      "details",
      userInfo
    );
  } catch (err) {
    return next(err);
  }
};

//pass the client valid inputs to service
export const getAllForDropDown = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user: any = await getUserListForDropDown(req);

    return await successResponseHandler(
      res,
      200,
      "User list fetch successfully!",
      null,
      user
    );
  } catch (err) {
    return next(err);
  }
};

//pass the client valid inputs to service
export const registerClientUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    req.body = _.pick(req.body, [
      "restaurantName",
      "restaurantAddress",
      "email",
      "phoneNumber",
      "password",
      "sourceId",
      "referPersonId",
      "lat",
      "long",
    ]);

    req.body.active = false;
    req.body.client = true;
    req.body.role = "CLIENT";

    const user: any = await createUser(req);

    const token = await getToken(user);

    return await successResponseHandler(
      res,
      201,
      "Client has been registered successfully!",
      "token",
      token
    );
  } catch (err) {
    return next(err);
  }
};

//pass the employee valid inputs to service
export const registerEmployeeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    req.body.s3BucketUrl = config.get<string>("USER_PROFILE_DOC_S3_BUCKET_URL");

    //Take the location from uploaded files and assign them dynamically to request body
    await filesMappingHelper(req);

    //Validation check for mandatory fields
    const checkMandatoryFields: any = await EmployeeRegisterRequest(req);

    if (checkMandatoryFields !== true) {
      if (_.size(req.body.unlinkArray))
        await multipleImageOrFileUnlink(req.body.unlinkArray);

      let customError: any = new Error(checkMandatoryFields[0].msg);
      customError.statusCode = 400;
      throw customError;
    }
    // "positionId", "phoneNumber", "countryName" , "profilePicture", "cv", "unlinkArray", "s3BucketUrl"

    req.body = _.pick(req.body, [
      "firstName",
      "lastName",
      "email",
      "positionId",
      "phoneNumber",
      "countryName",
      "profilePicture",
      "cv",
      "unlinkArray",
      "s3BucketUrl",
    ]);

    req.body.employee = true;
    req.body.active = false;
    req.body.role = "EMPLOYEE";

    const user: any = await createUser(req);

    // send mail with node mailer
    // mail for employee
    const mailData = {
      to: [user.email],
      subject: "Welcome Mail",
      html: ` <div>
      <p>
      <b>Dear ${user.name}</b>
        Thank you for your interest in joining our team at MH PREMIER STAFFING
        SOLUTIONS. We have received your application for the position of
        ${user.positionName}, and we appreciate the time and effort you put into
        your application. <br /> <br />
        We would like to inform you that your application has been received
        and is currently being reviewed. Our HR team will carefully consider
        your qualifications and experience, and we will get back to you within
        the next 24 hours to discuss the next steps in the hiring process.
        <br /> <br />
        In the meantime, if you have any questions or concerns, please do not
        hesitate to contact us at recruitment@mhpremierstaffingsolutions.com.
        <br /> <br />
        We appreciate your interest, and we look forward to speaking with you
        soon. <br />
      </p>
      <br /> <br />
      HR <br />
      MH PREMIER STAFFING SOLUTIONS
    </div>`,
    };

    await sendMailWithNodeMailer(mailData);

    // admin mail
    const adminMails = [
      "mirko@mhpremierstaffingsolutions.com",
      "alqurayish@mhpremierstaffingsolutions.com",
      "rose@mhpremierstaffingsolutions.com",
      "recruitment@mhpremierstaffingsolutions.com",
      "alqurayish@gmail.com",
    ];

    adminMails.map(async (mail) => {
      const adminMailData = {
        to: mail,
        subject: "New User Mail",
        html: ` <div>
              <p>
              Hello everyone 
              <b>${user.name}</b> register as a new employee/ client. <br />
              Thanks
              </p>
              <br /> <br />
              HR <br />
              MH PREMIER STAFFING SOLUTIONS
            </div>`,
      };

      await sendMailWithNodeMailer(adminMailData);
    });

    const token = await getToken(user);
    // return await successResponseHandler(res, 201, "Client has been registered successfully!", "token", token);
    return await successResponseHandler(
      res,
      201,
      "Client has been registered successfully!",
      "details",
      user
    );
  } catch (err) {
    return next(err);
  }
};

//pass the employee valid inputs to service
export const updateEmployeeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    req.body.s3BucketUrl = config.get<string>("USER_PROFILE_DOC_S3_BUCKET_URL");

    //Take the location from uploaded files and assign them dynamically to request body
    await filesMappingHelper(req);

    //Validation check for mandatory fields
    const checkMandatoryFields: any = await EmployeeUpdateRequest(req);

    if (checkMandatoryFields !== true) {
      if (_.size(req.body.unlinkArray))
        await multipleImageOrFileUnlink(req.body.unlinkArray);

      let customError: any = new Error(checkMandatoryFields[0].msg);
      customError.statusCode = 400;
      throw customError;
    }

    req.body = _.pick(req.body, [
      "id",
      "firstName",
      "lastName",
      "gender",
      "dateOfBirth",
      "email",
      "phoneNumber",
      "countryName",
      "presentAddress",
      "permanentAddress",
      "languages",
      "higherEducation",
      "licensesNo",
      "emmergencyContact",
      "skills",
      "positionId",
      "sourceId",
      "referPersonId",
      "employeeExperience",
      "profilePicture",
      "cv",
      "hourlyRate",
    ]);

    const user: any = await updateUser(req);

    return await successResponseHandler(
      res,
      200,
      "Employee has been updated successfully!"
    );
  } catch (err) {
    console.log("err: ", err);

    return next(err);
  }
};

//pass the employee valid inputs to service
export const registerMhEmployeeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    req.body = _.pick(req.body, [
      "name",
      "email",
      "phoneNumber",
      "password",
      "role",
      "active",
      "permissions",
    ]);

    req.body.isMhEmployee = true;

    const user: any = await createMhUser(req);

    return await successResponseHandler(
      res,
      201,
      "Employee has been registered successfully!"
    );
  } catch (err) {
    return next(err);
  }
};

//pass the employee valid inputs to service
export const updatePushNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    req.body = _.pick(req.body, ["uuid", "fcmToken", "platform"]);

    const user: any = await updateUserPushNotificationInfo(req);

    return await successResponseHandler(
      res,
      201,
      "Push notification has been updated successfully!"
    );
  } catch (err) {
    return next(err);
  }
};

//pass the employee valid inputs to service
export const updateMhEmployeeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    req.body = _.pick(req.body, [
      "id",
      "name",
      "email",
      "phoneNumber",
      "role",
      "active",
      "permissions",
    ]);

    const user: any = await updateMhUser(req);

    return await successResponseHandler(
      res,
      201,
      "Employee has been registered successfully!"
    );
  } catch (err) {
    return next(err);
  }
};

export const updateUserProfilePicture = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    req.body.s3BucketUrl = config.get<string>("USER_PROFILE_DOC_S3_BUCKET_URL");

    //Take the location from uploaded files and assign them dynamically to request body
    await filesMappingHelper(req);

    //Validation check for mandatory fields
    const checkMandatoryFields: any = await UserProfilePicturesUploadRequest(
      req
    );

    if (checkMandatoryFields !== true) {
      if (_.size(req.body.unlinkArray))
        await multipleImageOrFileUnlink(req.body.unlinkArray);

      let customError: any = new Error(checkMandatoryFields[0].msg);
      customError.statusCode = 400;
      throw customError;
    }

    req.body = _.pick(req.body, [
      "id",
      "profilePicture",
      "cv",
      "unlinkArray",
      "s3BucketUrl",
    ]);

    const user = await updateUser(req);

    const token = await getToken(user);

    return await successResponseHandler(
      res,
      200,
      "Profile picture updated successfully!",
      "token",
      token
    );
  } catch (err) {
    return next(err);
  }
};

export const updateCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    req.body.s3BucketUrl = config.get<string>("USER_PROFILE_DOC_S3_BUCKET_URL");

    //Take the location from uploaded files and assign them dynamically to request body
    await filesMappingHelper(req);

    //Validation check for mandatory fields
    const checkMandatoryFields: any = await UserCertificatesUploadRequest(req);

    if (checkMandatoryFields !== true) {
      if (_.size(req.body.unlinkArray))
        await multipleImageOrFileUnlink(req.body.unlinkArray);

      let customError: any = new Error(checkMandatoryFields[0].msg);
      customError.statusCode = 400;
      throw customError;
    }

    req.body = _.pick(req.body, [
      "id",
      "certificateId",
      "certificateName",
      "attachment",
      "unlinkArray",
      "s3BucketUrl",
    ]);

    const user = await updateUserCertificateInfo(req);

    return await successResponseHandler(
      res,
      200,
      "Certificate updated successfully!"
    );
  } catch (err) {
    return next(err);
  }
};

//Passing email/phone number and password
//Generate user token and return to client
export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    req.body = _.pick(req.body, ["email", "phoneNumber", "password"]);

    const token = await login(req.body);

    return await successResponseHandler(
      res,
      200,
      "Login is successfully!",
      "token",
      token
    );
  } catch (err) {
    return next(err);
  }
};

//only id and email is passed to service after password checking
export const updateUserEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    //@ts-ignore
    const loggedInUserInfo = req.user;

    if (loggedInUserInfo._id.toString() !== req.body.id)
      throw new Error("Users are only allowed to change their own Email");

    // await verifyOtp(req.body.otpNumberForEmail, null, req.body.email, "email_update", "email");

    req.body = { id: req.body.id, email: req.body.email };

    const user = await updateUser(req);

    if (!user) throw Error("Existing Email is inserted");

    const token = await getToken(user);

    return await successResponseHandler(
      res,
      200,
      "User email updated successfully!",
      "token",
      token
    );
  } catch (err) {
    return next(err);
  }
};

//only id and phoneNumber is passed to service after password checking
export const updateUserPhoneNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    //@ts-ignore
    const loggedInUserInfo = req.user;

    if (loggedInUserInfo._id.toString() !== req.body.id)
      throw new Error(
        "Users are only allowed to change their own phone number"
      );

    // await verifyOtp(req.body.otpNumberForPhone, req.body.phoneNumber, null, "phone_update", "phone");

    req.body = {
      id: req.body.id,
      phoneNumber: req.body.phoneNumber,
      countryCodeForPhone: req.body.countryCode,
    };

    const user = await updateUser(req);

    if (!user) throw Error("Existing Phone is inserted");

    const token = await getToken(user);

    return await successResponseHandler(
      res,
      200,
      "User phone number updated successfully!",
      "token",
      token
    );
  } catch (err) {
    return next(err);
  }
};

//only id and password is passed to service after password checking
export const updateUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    req.body = { id: req.body.id, password: req.body.newPassword };

    const user: any = await updateUser(req);

    return await successResponseHandler(
      res,
      200,
      "User password updated successfully!"
    );
  } catch (err) {
    return next(err);
  }
};

//request is passed to service for sending otp
export const userForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    req.body = { email: req.body.email, phoneNumber: req.body.phoneNumber };

    const otp = await forgotPassword(req);

    return await successResponseHandler(
      res,
      200,
      "We have sent 2 OTP's. Please check your email and phone!"
    );
  } catch (err) {
    return next(err);
  }
};

//request is passed to service for otp checking and updating password
export const userResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const body: any = _.clone(req.body);

    req.body = _.pick(body, [
      "email",
      "phoneNumber",
      "password",
      "confirmPassword",
      "otpNumber",
    ]);

    const user: any = await resetPassword(req);

    req.body = {
      action: "reset-password",
      name: user.name,
      email: user.email,
      otp: body.otpNumber,
      otpType: "password-change-confirmation",
      login: config.get<string>("FRONT_END_LOGIN_URL"),
      subject: config.get<string>("APPLICATION_SHORT_NAME") + " Password Reset",
    };

    const sentEmail = await addEmailNotificationInfo(req);

    return await successResponseHandler(
      res,
      200,
      "Your password has been updated successfully! Please login again!"
    );
  } catch (err) {
    return next(err);
  }
};

//request is passed to service for updating active status
export const userUpdateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    req.body = { id: req.body.id, active: req.body.active };

    const user = await updateUser(req);

    return await successResponseHandler(
      res,
      200,
      "User info has been updated successfully"
    );
  } catch (err) {
    return next(err);
  }
};

//request is passed to service for updating refer person status
export const userReferPersonUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    req.body = { id: req.body.id, isReferPerson: req.body.isReferPerson };

    const user = await updateUser(req);

    return await successResponseHandler(
      res,
      200,
      "Refer person info has been updated successfully"
    );
  } catch (err) {
    return next(err);
  }
};

//request is passed to service for updating client discount
export const clientDiscountUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    req.body = { id: req.body.id, clientDiscount: req.body.clientDiscount };

    const user = await updateUser(req);

    return await successResponseHandler(
      res,
      200,
      "Client discount has been updated successfully"
    );
  } catch (err) {
    return next(err);
  }
};

//request is passed to service for updating refer person status
export const updateBankDress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    req.body = _.pick(req.body, [
      "id",
      "bankName",
      "accountNumber",
      "routingNumber",
      "dressSize",
      "additionalOne",
      "additionalTwo",
    ]);

    const user = await updateUser(req);

    return await successResponseHandler(
      res,
      200,
      "Bank and dress info has been updated successfully"
    );
  } catch (err) {
    return next(err);
  }
};

//
//request is passed to service for updating user active/deleted with related info
export const removeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user = await removeUserInfo(req);

    return await successResponseHandler(
      res,
      200,
      "Your account has been deleted successfully"
    );
  } catch (err) {
    return next(err);
  }
};

//Passing id and inputs to user service
export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    req.body = _.pick(req.body, ["id", "nidNumber", "passportNumber"]);
    req.body.verified = true;
    req.body.basicCompleted = true;

    const user = await updateUser(req);

    // if (user && !user.subUser) await addUserInDefaultRole(req);

    const token = await getToken(user);

    return await successResponseHandler(
      res,
      200,
      "User profile updated successfully!",
      "token",
      token
    );
  } catch (err) {
    return next(err);
  }
};

//Passing id and inputs to user service
export const removeCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    req.body = _.pick(req.body, ["id", "certificateId"]);

    const user = await removeEmployeeCertificateInfo(req);

    return await successResponseHandler(
      res,
      200,
      "Certificate remove successfully!!"
    );
  } catch (err) {
    return next(err);
  }
};
