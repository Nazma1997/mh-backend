import { Request } from "express";
import mongoose, { FilterQuery, DocumentDefinition, ObjectId } from "mongoose";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";
import _ from "lodash";
import moment from "moment";

import User, { UserInput, UserDocument, UserTokenDocument, UserStatusDocument, MhUserInput, UserCertificateInputDocument, UserPushNotificationInput } from "../models/user-model";
import { generateNewNanoId } from "../helpers/nano-id-helper";
import { getPagination } from "../helpers/pagination-helper";
import { imageOrFileUnlink, multipleImageOrFileUnlink } from "./aws-s3-service";
import { getSkillListByFilterQuery } from "./skill-service";
import { getSourceInfoByFilterQuery } from './source-service';
import { getPositionInfoByFilterQuery } from "./position-service";
import { getUserInfoBasedOnPushNotificationInfo } from "./push-notification-service";


//pull user info by userId if exists
export const getUserInfoById = async (id: ObjectId) => {
    try {
        return await User.findById(id);
    } catch (err: any) {
        throw err;
    }
};

//getting user info by filter query
export const getUserInfoByFilterQuery = async (query: FilterQuery<UserDocument>) => {
    try {
        return await User.findOne(query);
    } catch (err: any) {
        throw err;
    }
};

//getting user list by filter query
export const getUserListByFilterQuery = async (query: FilterQuery<UserDocument>) => {
    try {
        return await User.find(query);
    } catch (err: any) {
        throw err;
    }
};

//getting user info by filter query
export const getUsersByFilterQuery = async (query: FilterQuery<UserDocument>, fileds?: Object) => {
    try {
        let selectedFileds: Object = {};
        if (fileds) selectedFileds = fileds;

        return await User.find(query, selectedFileds);
    } catch (err: any) {
        throw err;
    }
};

//Random Password Generation
export const generateRandomPassword = async (noOfCharacter: number) => {
    return Math.random().toString(36).slice(-noOfCharacter);
};

//Generate Hashed Password With Salts
export const createHashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(config.get<number>("SALT_ROUNDS"));

    return await bcrypt.hash(password, salt);
};

//Compare Given Passwords
export const comparePassword = async (password: string, hashPassword: string) => {
    return await bcrypt.compare(password, hashPassword);
};

export const getToken = async (user: any) => {

    //set some information of user for token generate
    const userToken: DocumentDefinition<UserTokenDocument> = _.pick(user, [
        "_id", "name", "email", "userIdNumber", "phoneNumber", "role", "position", "profileCompleted", "profilePicture", "cv", "verified", "active",
        "employee", "client", "admin", "hr", "gender", "dateOfBirth", "presentAddress", "permanentAddress", "language", "higherEducation",
        "licensesNo", "certificationsName", "emmergencyContact", "skill", "countryName", "countryCode", "sourceId", "referPersonName",
        "restaurantName", "restaurantAddress", "employeeExperience", "rating", "totalWorkingHour", "isReferPerson", "isHired", "hiredFromDate",
        "hiredToDate", "hiredBy", "menuPermission", "isMhEmployee", "languages", "clientDiscount", "lat", "long", "hiredByLat", "hiredByLong", "hiredByRestaurantName", "hiredByRestaurantAddress"
    ]);

    return await generateToken(userToken);
};

//Generate Token
const generateToken = async (user: DocumentDefinition<UserTokenDocument>) => {
    return jwt.sign(user, config.get<string>("JWT_SECRET"), { expiresIn: '7d' });
};

//Check if an email already exist in Database
export const emailAlreadyIsNotExists = async (email: string, id?: ObjectId) => {
    const query: any = { email: email };

    if (id) query._id = { $ne: id };

    const user: any = await getUserInfoByFilterQuery(query);

    if (user) {
        const customError: any = new Error("Sorry, this email already exists!. Please enter a new email.");
        customError.statusCode = 400;
        throw customError;
    } else return true;
};

//Check if an phone number already exist in Database
export const phoneNumberAlreadyIsNotExists = async (phone: String, id?: ObjectId) => {

    const query: any = { phoneNumber: phone };

    if (id) query._id = { $ne: id };

    const user: any = await getUserInfoByFilterQuery(query);

    if (user) {
        const customError: any = new Error("Sorry, this Phone number already exists!. Please enter a new email.");
        customError.statusCode = 400;
        throw customError;
    } else return true;
};

//Verify user token
export const verifyToken = async (token: string) => {

    const splitedToken = token ? token.split('Bearer ') : '';
    const user: any = splitedToken && splitedToken[1] ? jwt.verify(splitedToken[1], config.get<string>("JWT_SECRET")) : false;

    let customError: any = {};

    if (!user) {
        customError = new Error("Bad token format!");
        customError.statusCode = 400;
        throw customError;
    }

    const userInfo = (user && user._id) ? await getUserInfoByFilterQuery({ _id: user._id, active: true }) : false;

    if (userInfo) return userInfo;
    else {
        customError = new Error("Invalid token!");
        customError.statusCode = 400;
        throw customError;
    }
};

//pull user info according to id number if exists in the database.
export const verifyNewUserIdNumber = async (userIdNumber: String, session?: any) => {
    try {
        const user: any = await getUserInfoByFilterQuery({ userIdNumber: userIdNumber });
        if (user) {
            // const newUserIdNumber = await generateNewNanoId(true, 7, "QT-");
            //generate new user id number
            let nanoidGenrateKey: any;

            if (user.client) nanoidGenrateKey = "C";
            else if (user.client) nanoidGenrateKey = "E";

            let newUserIdNumber: any = await generateNewNanoId(true, 7, nanoidGenrateKey);
            await verifyNewUserIdNumber(newUserIdNumber);
        } else {
            return userIdNumber;
        }
    } catch (err: any) {
        throw err;
    }
};

const getSkillRelatedInfo = async (skills: any) => {

    const skillIds = _.compact(_.uniq(skills));

    const newSkills: any = [];

    const skillListInfo = await getSkillListByFilterQuery({ _id: { $in: skillIds }, active: true });

    if (_.size(skillListInfo) !== _.size(skillIds)) {
        const customError: any = new Error("Invalid skill info!");
        customError.statusCode = 400;
        throw customError;
    }

    await Promise.all(_.map(skillListInfo, async (skillInfo: any) => {
        newSkills.push({ skillId: skillInfo._id, skillName: skillInfo.name });
    }));

    return _.size(newSkills) ? newSkills : [];
};

//Add user to Database
export const createUser = async (req: Request) => {
    try {
        const input: DocumentDefinition<UserDocument> = req.body;

        input.email = input.email.toLowerCase();

        input.emailVerified = false;
        input.phoneNumberVerified = true;
        input.verified = false;

        //generate new user id number
        let nanoidGenrateKey: any;

        if (input.client) {
            nanoidGenrateKey = "C";
            input.password = await createHashPassword(input.password);

        } else if (input.employee) {

            nanoidGenrateKey = "E";
            const generatePassword: any = await generateNewNanoId(true, 6, "P");

            input.password = await createHashPassword(generatePassword);
            input.plainPassword = generatePassword;

            input.name = input.firstName + " " + input.lastName;

            const positionInfo: any = await getPositionInfoByFilterQuery({ _id: req.body.positionId, active: true });

            if (!positionInfo) {
                const customError: any = new Error("Invalid position info!");
                customError.statusCode = 400;
                throw customError;
            }

            input.positionName = positionInfo.name;
        }

        let newUserIdNumber: any = await generateNewNanoId(true, 7, nanoidGenrateKey);

        //Verify new user id number
        const verifyNanoId: any = await verifyNewUserIdNumber(newUserIdNumber);
        input.userIdNumber = verifyNanoId;

        const addUserInfo: any = await User.create(input);

        if (addUserInfo && input) {

            const notificationData: any = {};

            if (input.client) {
                notificationData.title = 'New Client Registered';
                notificationData.body = `${input.restaurantName} restaurant registered `;
            } else if (input.employee) {
                notificationData.title = 'New Employee Registered';
                notificationData.body = `${input.name} registered as a ${input.positionName}`;
            }

            await getUserInfoBasedOnPushNotificationInfo({ email: config.get<string>("ADMIN_PUSH_NOTIFICATION_EMAIL") }, notificationData);
        }

        return addUserInfo;

    } catch (err: any) {

        // If an any error when create to techpack trim info then unlinked user profile from aws s3
        if (_.size(req.body.unlinkArray)) await multipleImageOrFileUnlink(req.body.unlinkArray);

        throw err;
    }
};

//Add MH user to Database
export const createMhUser = async (req: Request) => {
    try {
        const input: DocumentDefinition<MhUserInput> = req.body;

        //set user menu permission
        let permissions: any = {};

        if (_.size(input.permissions)) {

            await Promise.all(_.map(input.permissions, async (item: any) => {

                if (item === "POSITION") permissions.position = true;
                if (item === "SKILL") permissions.skill = true;
                if (item === "SOURCE") permissions.source = true;
                if (item === "EMPLOYEE_LIST") permissions.employeeList = true;
                if (item === "CLIENT_LIST") permissions.clientList = true;
                if (item === "CLIENT_EMPLOYEE_LIST") permissions.clientEmployeeList = true;
                if (item === "MH_EMPLOYEE_LIST") permissions.mhEmployeeList = true;
                if (item === "ADD_MH_EMPLOYEE") permissions.addMhEmployee = true;

            }));
        }

        if (input.role === "ADMIN") input.admin = true;
        if (input.role === "HR") input.hr = true;
        if (input.role === "MARKETING") input.marketing = true;

        input.menuPermission = permissions;
        input.emailVerified = false;
        input.phoneNumberVerified = true;
        input.verified = false;

        input.plainPassword = input.password;
        input.password = await createHashPassword(input.password);

        let newUserIdNumber: any = await generateNewNanoId(true, 7, "MHE");

        //Verify new user id number
        const verifyNanoId: any = await verifyNewUserIdNumber(newUserIdNumber);
        input.userIdNumber = verifyNanoId;

        return await User.create(input);

    } catch (err: any) {
        throw err;
    }
};

//Update MH user to Database
export const updateMhUser = async (req: Request) => {
    try {
        const input: DocumentDefinition<MhUserInput> = req.body;

        const mhUserInfo: any = await getUserInfoById(req.body.id);

        if (!mhUserInfo) {
            const customError: any = new Error("Invalid user info!");
            customError.statusCode = 400;
            throw customError;
        }

        //set user menu permission
        let permissions: any = {};

        if (_.size(input.permissions)) {

            await Promise.all(_.map(input.permissions, async (item: any) => {

                if (item === "POSITION") permissions.position = true;
                if (item === "SKILL") permissions.skill = true;
                if (item === "SOURCE") permissions.source = true;
                if (item === "EMPLOYEE_LIST") permissions.employeeList = true;
                if (item === "CLIENT_LIST") permissions.clientList = true;
                if (item === "CLIENT_EMPLOYEE_LIST") permissions.clientEmployeeList = true;
                if (item === "MH_EMPLOYEE_LIST") permissions.mhEmployeeList = true;
                if (item === "ADD_MH_EMPLOYEE") permissions.addMhEmployee = true;

            }));
        }

        if (input.role === "ADMIN") input.admin = true;
        if (input.role === "HR") input.hr = true;
        if (input.role === "MARKETING") input.marketing = true;

        input.menuPermission = permissions;

        return await User.updateOne({ _id: req.body.id }, { $set: input });

    } catch (err: any) {
        throw err;
    }
};

//Update user push notification info to Database
export const updateUserPushNotificationInfo = async (req: Request) => {
    try {
        const updateData: DocumentDefinition<UserPushNotificationInput> = req.body;

        //@ts-ignore
        const loggedInUserInfo: any = req.user;

        const mhUserInfo: any = await getUserInfoById(loggedInUserInfo._id);

        if (!mhUserInfo) {
            const customError: any = new Error("Invalid user info!");
            customError.statusCode = 400;
            throw customError;
        }

        const setData: any = { pushNotificationDetails: { uuid: updateData.uuid, fcmToken: updateData.fcmToken, platform: updateData.platform } };

        return await User.updateOne({ _id: loggedInUserInfo._id }, { $set: setData });

    } catch (err: any) {
        throw err;
    }
};

//update user info according to user id.
export const updateUser = async (req: Request) => {
    try {
        const updateData: DocumentDefinition<UserDocument> = req.body;

        const userInfo: any = await getUserInfoById(req.body.id);

        if (!userInfo) {
            const customError: any = new Error("Invalid User info!");
            customError.statusCode = 400;
            throw customError;
        }

        const user: any = new User(userInfo);
        let isChanged = false;

        if (updateData.firstName && userInfo.firstName !== updateData.firstName) {
            isChanged = true;
            user.firstName = updateData.firstName;
        }

        if (updateData.lastName && userInfo.lastName !== updateData.lastName) {
            isChanged = true;
            user.lastName = updateData.lastName;
        }

        if (updateData.gender && userInfo.gender !== updateData.gender) {
            isChanged = true;
            user.gender = updateData.gender;
        }

        if (updateData.dateOfBirth && userInfo.dateOfBirth !== updateData.dateOfBirth) {
            isChanged = true;
            user.dateOfBirth = updateData.dateOfBirth;
        }

        if (updateData.email && userInfo.email !== updateData.email) {
            isChanged = true;
            user.email = updateData.email;
        }

        if (updateData.phoneNumber && userInfo.phoneNumber !== updateData.phoneNumber) {
            isChanged = true;
            user.phoneNumber = updateData.phoneNumber;
        }

        if (updateData.countryName && userInfo.countryName !== updateData.countryName) {
            isChanged = true;
            user.countryName = updateData.countryName;
        }

        if (updateData.presentAddress && userInfo.presentAddress !== updateData.presentAddress) {
            isChanged = true;
            user.presentAddress = updateData.presentAddress;
        }

        if (updateData.permanentAddress && userInfo.permanentAddress !== updateData.permanentAddress) {
            isChanged = true;
            user.permanentAddress = updateData.permanentAddress;
        }

        //array field
        if (_.size(updateData.languages)) {
            isChanged = true;
            user.languages = updateData.languages;
        }

        if (updateData.higherEducation && userInfo.higherEducation !== updateData.higherEducation) {
            isChanged = true;
            user.higherEducation = updateData.higherEducation;
        }

        if (updateData.licensesNo && userInfo.licensesNo !== updateData.licensesNo) {
            isChanged = true;
            user.licensesNo = updateData.licensesNo;
        }

        if (updateData.emmergencyContact && userInfo.emmergencyContact !== updateData.emmergencyContact) {
            isChanged = true;
            user.emmergencyContact = updateData.emmergencyContact;
        }

        //array field
        if (_.size(updateData.skills)) {
            isChanged = true;
            user.skills = await getSkillRelatedInfo(updateData.skills);
        }

        if (updateData.positionId || userInfo.positionId.toString() !== updateData.positionId) {

            const positionInfo: any = await getPositionInfoByFilterQuery({ _id: updateData.positionId, active: true });

            if (!positionInfo) {
                const customError: any = new Error("Invalid position info!");
                customError.statusCode = 400;
                throw customError;
            }

            isChanged = true;

            user.positionId = updateData.positionId;
            user.positionName = positionInfo.name;
        }

        // console.log("userInfo.sourceId.toString(); ", userInfo.sourceId);

        if (updateData.sourceId || userInfo.sourceId && userInfo.sourceId.toString() !== updateData.sourceId) {

            const sourceInfo: any = await getSourceInfoByFilterQuery({ _id: updateData.sourceId, active: true });

            if (!sourceInfo) {
                const customError: any = new Error("Invalid source info!");
                customError.statusCode = 400;
                throw customError;
            }

            isChanged = true;
            user.sourceId = updateData.sourceId;
            user.sourceName = sourceInfo.name;
        }

        if (updateData.referPersonId || userInfo.referPersonId && userInfo.referPersonId.toString() !== updateData.referPersonId) {

            const userInfo: any = await getUserInfoById(req.body.referPersonId);

            if (!userInfo) {
                const customError: any = new Error("Invalid refer person info!");
                customError.statusCode = 400;
                throw customError;
            }

            isChanged = true;

            user.referPersonId = updateData.referPersonId;
            user.referPersonName = userInfo.name;
        }

        if (updateData.employeeExperience && userInfo.employeeExperience !== updateData.employeeExperience) {
            isChanged = true;
            user.employeeExperience = updateData.employeeExperience;
        }

        if (updateData.bankName && userInfo.bankName !== updateData.bankName) {
            isChanged = true;
            user.bankName = updateData.bankName;
        }

        if (updateData.accountNumber && userInfo.accountNumber !== updateData.accountNumber) {
            isChanged = true;
            user.accountNumber = updateData.accountNumber;
        }

        if (updateData.routingNumber && userInfo.routingNumber !== updateData.routingNumber) {
            isChanged = true;
            user.routingNumber = updateData.routingNumber;
        }

        if (updateData.dressSize && userInfo.dressSize !== updateData.dressSize) {
            isChanged = true;
            user.dressSize = updateData.dressSize;
        }

        if (updateData.additionalOne && userInfo.additionalOne !== updateData.additionalOne) {
            isChanged = true;
            user.additionalOne = updateData.additionalOne;
        }

        if (updateData.additionalTwo && userInfo.additionalTwo !== updateData.additionalTwo) {
            isChanged = true;
            user.additionalTwo = updateData.additionalTwo;
        }

        if (updateData.clientDiscount && userInfo.clientDiscount !== updateData.clientDiscount) {
            isChanged = true;
            user.clientDiscount = updateData.clientDiscount;
        }

        if (updateData.hourlyRate && userInfo.hourlyRate !== updateData.hourlyRate) {
            isChanged = true;
            user.hourlyRate = updateData.hourlyRate;
        }

        if (typeof updateData.active === 'boolean' && userInfo.active !== updateData.active) {
            isChanged = true;
            user.active = updateData.active;
        }

        if (typeof updateData.isReferPerson === 'boolean' && userInfo.isReferPerson !== updateData.isReferPerson) {
            isChanged = true;
            user.isReferPerson = updateData.isReferPerson;
        }

        const s3BucketUrl: string = req.body.s3BucketUrl;
        const unlinkedArray: any = [];

        if (updateData.profilePicture && userInfo.profilePicture !== updateData.profilePicture) {
            isChanged = true;
            user.profilePicture = updateData.profilePicture;

            unlinkedArray.push({ Key: s3BucketUrl + "/" + userInfo.profilePicture });
        }

        if (updateData.cv && userInfo.cv !== updateData.cv) {
            isChanged = true;
            user.cv = updateData.cv;

            unlinkedArray.push({ Key: s3BucketUrl + "/" + userInfo.cv });
        }

        if (updateData.password && userInfo.password !== updateData.password) {
            isChanged = true;
            user.password = await createHashPassword(updateData.password);
        }

        if (isChanged) {
            const updateUser = await user.save();

            if (_.size(unlinkedArray)) await multipleImageOrFileUnlink(unlinkedArray);

            return updateUser;
        }

    } catch (err: any) {

        // If an any error when create to techpack trim info then unlinked user profile from aws s3
        if (_.size(req.body.unlinkArray)) await multipleImageOrFileUnlink(req.body.unlinkArray);

        throw err;
    }
};

//update user certificate info
export const updateUserCertificateInfo = async (req: Request) => {
    try {
        let updateData: DocumentDefinition<UserDocument> = req.body;

        //@ts-ignore
        const loggedInUserInfo = req.user;

        const id = req.body.id;
        const userInfo: any = await getUserInfoById(req.body.id);

        if (!userInfo) {
            const customError: any = new Error("Invalid User info!");
            customError.statusCode = 400;
            throw customError;
        }

        let setOrAddTosetData = {};
        let query: any = { _id: id };

        const s3BucketUrl: string = req.body.s3BucketUrl;
        const unlinkedArray: any = [];

        if (updateData.certificateId) {

            query["certificates"] = {
                $elemMatch: {
                    "certificateId": updateData.certificateId
                }
            };

            const certificates: any = userInfo.certificates;

            const matchedCertificateInfo = _.find(certificates, (certificateInfo) => {
                if (certificateInfo && certificateInfo.certificateId.toString() === updateData.certificateId) {
                    return certificateInfo;
                }
            });

            if (matchedCertificateInfo) {
                unlinkedArray.push({ Key: s3BucketUrl + "/" + matchedCertificateInfo.attachment });

                setOrAddTosetData = {
                    $set: {
                        "certificates.$.certificateName": updateData.certificateName,
                        "certificates.$.attachment": updateData.attachment
                    }
                };
            }

        } else {

            updateData.certificateId = new mongoose.Types.ObjectId();

            const newSketchData: any = {
                certificateId: updateData.certificateId,
                certificateName: updateData.certificateName,
                attachment: updateData.attachment
            };

            setOrAddTosetData = { $addToSet: { certificates: newSketchData } };
        }

        if (_.size(setOrAddTosetData)) await User.updateOne(query, setOrAddTosetData);

        return updateData;

    } catch (err: any) {

        // If an any error when create to techpack trim info then unlinked user profile from aws s3
        if (_.size(req.body.unlinkArray)) await multipleImageOrFileUnlink(req.body.unlinkArray);

        throw err;
    }
};

//remove user info and related info
export const removeUserInfo = async (req: Request) => {
    try {

        const query = { _id: req.body.id };

        const userInfo: any = await getUserInfoByFilterQuery(query);

        if (!userInfo) {
            const customError: any = new Error("Invalid User info");
            customError.statusCode = 400;
            throw customError;
        }

        return await User.updateOne(query, { $set: { deleted: true, active: false } });

    } catch (err: any) {
        throw err;
    }
};

//Check login credentials with database 
export const login = async (loginData: DocumentDefinition<UserInput>) => {
    try {

        const loginQuery: any = {};

        let errorMessage: string = "";

        if (loginData.email) {
            errorMessage = "You provided email and password combination didn't match!";
            loginQuery.email = loginData.email;
        } else if (loginData.userIdNumber) {
            errorMessage = "You provided user id number and password combination didn't match!";
            loginQuery.userIdNumber = loginData.userIdNumber;
        }

        let customError: any = {};

        if (!_.size(loginQuery)) {
            customError = new Error("Please enter your registered email/user id number and password");
            customError.statusCode = 400;
            throw customError;
        }

        const user: any = await getUserInfoByFilterQuery(loginQuery);

        if (!user) {
            customError = new Error(errorMessage);
            customError.statusCode = 400;
            throw customError;
        }

        if (!user.active) {
            customError = new Error("Sorry! User has been deactivated. For more information contact us");
            customError.statusCode = 401;
            throw customError;
        }

        if (user.deleted) {
            customError = new Error("" + user.deactivatedReason);
            customError.statusCode = 401;
            throw customError;
        }

        if (await comparePassword(loginData.password, user.password)) {

            return await getToken(user);

        } else {
            customError = new Error("The password you provided didn't match with our records!");
            customError.statusCode = 400;
            throw customError;
        }

    } catch (err: any) {
        throw err;
    }
};

//user can give email or password and otp will be sent to that medium
export const forgotPassword = async (req: Request) => {
    try {

        const input: DocumentDefinition<UserInput> = req.body;

        let customError: any = {};
        let errorMessage: string = '';

        const query: any = {};

        if (input.email) {
            query.email = input.email;
            const emailOtpInfo: any = { email: req.body.email, otpType: "email" };
            req.body = emailOtpInfo;
            errorMessage = "Invalid email address!";
        }

        if (input.userIdNumber) {
            query.userIdNumber = input.userIdNumber;
            const phoneOtpInfo: any = { userIdNumber: req.body.userIdNumber, otpType: "phone" };
            req.body = phoneOtpInfo;
            errorMessage = "Invalid phone number!";
        }

        if (!_.size(query)) {
            customError = new Error(errorMessage);
            customError.statusCode = 400;
            throw customError;
        }

        const user = await getUserInfoByFilterQuery(query);

        if (!user) {
            customError = new Error("Invalid email/user id number!");
            customError.statusCode = 400;
            throw customError;
        }

        req.body.name = user.name;

        const createdBy = user._id;

    } catch (err: any) {
        throw err;
    }
};

//otp and new password will be given by the user.
//check the otp and update the password
export const resetPassword = async (req: Request) => {
    try {

        let customError: any = {};
        let errorMessage: string = '';
        let OtpVerified: boolean = false;

        const query: any = {};

        if (req.body.email) {
            query.email = req.body.email;
            errorMessage = "Invalid email!";
        }

        if (req.body.userIdNumber) {
            query.userIdNumber = req.body.userIdNumber;
            errorMessage = "Invalid user id number!";
        }

        if (!_.size(query)) {
            customError = new Error(errorMessage);
            customError.statusCode = 400;
            throw customError;
        }

        const user: any = await getUserInfoByFilterQuery(query);

        if (!user) {
            customError = new Error("Invalid email/user id number!");
            customError.statusCode = 400;
            throw customError;
        }

        // if (req.body.userIdNumber) {
        //     OtpVerified = await verifyOtp(req.body.otpNumber, req.body.userIdNumber, null, "forgot_password", "phone");

        // } else if (req.body.email) {
        //     OtpVerified = await verifyOtp(req.body.otpNumber, null, req.body.email, "forgot_password", "email");
        // }

        if (!OtpVerified) {
            customError = new Error("Wrong OTP! Please try again!");
            customError.statusCode = 400;
            throw customError;
        }

        req.body = { id: user._id, password: req.body.password };

        //@ts-ignore
        req.user = user;

        return await updateUser(req);


    } catch (err: any) {
        throw err;
    }
};

//Get All Reader API
export const getUserList = async (req: Request) => {
    try {
        let pagination: any = await getPagination(req);

        const query: FilterQuery<UserDocument> = { isMhEmployee: false };

        let { active, positionId, rating, employeeExperience, minTotalHour, maxTotalHour, isReferPerson, requestType, viewType, mhEmployee, fromDate, toDate }: any = req.query;
        const searchKeyword: any = req.query.searchKeyword;

        if (active === "YES") query.active = true;
        else if (active === "NO") query.active = false;

        if (isReferPerson === "YES") query.isReferPerson = true;
        else if (isReferPerson === "NO") query.isReferPerson = false;

        if (positionId) {
            const positionId: any = req.query.positionId;
            query.positionId = new mongoose.Types.ObjectId(positionId);
        }

        if (rating) query.rating = rating;
        if (employeeExperience) query.employeeExperience = employeeExperience;
        if (minTotalHour) query.totalWorkingHour = minTotalHour;
        if (maxTotalHour) query.totalWorkingHour = maxTotalHour;
        if (minTotalHour && maxTotalHour) query.totalWorkingHour = { $lte: minTotalHour, $gte: maxTotalHour };

        if (requestType && requestType === "EMPLOYEE") query.employee = true;
        else if (requestType && requestType === "CLIENT") query.client = true;
        else if (requestType && requestType === "HR") query.hr = true;
        else if (requestType && requestType === "ADMIN") query.admin = true;

        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }

        if (viewType === "public") {
            // based on viewType some fields assign here
            query.active = true;
        }

        if (fromDate) {
            fromDate = moment(fromDate).startOf('day').toDate();
            toDate = toDate ? moment(toDate).endOf('day').toDate() : moment().endOf('day').toDate();

            const formateFromDate = moment(fromDate).format('YYYY-MM-DD');
            const formateToDate = moment(toDate).format('YYYY-MM-DD');

            if (formateFromDate > formateToDate) toDate = fromDate;

            query.createdAt = { $gte: fromDate, $lte: toDate };

        } else if (!fromDate && toDate) {
            fromDate = moment().startOf('day').toDate();
            toDate = moment().endOf('day').toDate();

            query.createdAt = { $gte: fromDate, $lte: toDate };
        }

        if (req.query.skipLimit === "YES") pagination = { sort: pagination.sort };

        const users = await User.find(query, {}, pagination);
        const totalUsers = await User.find(query).count();

        return {
            total: totalUsers,
            count: users.length,
            next: users.length === pagination.limit ? pagination.skip + pagination.limit : null,
            users
        };

    } catch (err: any) {
        throw err;
    }
};

//get list for dropdown 
export const getUserListForDropDown = async (req: Request) => {
    try {

        let pagination: any = await getPagination(req);

        pagination.sort = { name: 1 };

        const query: FilterQuery<UserDocument> = { active: true, isMhEmployee: false };

        const searchKeyword: any = req.query.searchKeyword;

        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');

            query.name = regExSearch;
        }

        const users = await User.find(query, { name: 1 }, pagination);

        return {
            count: users.length,
            next: users.length === pagination.limit ? pagination.skip + pagination.limit : null,
            users
        };

    } catch (err: any) {
        throw err;
    }
};

//get mh employee user info
export const getMhEmployeeUserList = async (req: Request) => {
    try {

        let pagination: any = await getPagination(req);

        const query: FilterQuery<UserDocument> = { isMhEmployee: true };

        const { active } = req.query;
        const searchKeyword: any = req.query.searchKeyword;

        if (active === "YES") query.active = true;
        else if (active === "NO") query.active = false;

        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');

            query.name = regExSearch;
        }

        const users = await User.find(query, { name: 1, email: 1, phoneNumber: 1, role: 1, active: 1, plainPassword: 1 }, pagination);
        const totalUsers = await User.find(query).count();

        return {
            total: totalUsers,
            count: users.length,
            next: users.length === pagination.limit ? pagination.skip + pagination.limit : null,
            users
        };

    } catch (err: any) {
        throw err;
    }
};

//removed employee certificate info
export const removeEmployeeCertificateInfo = async (req: Request) => {
    try {
        const updateData: DocumentDefinition<UserCertificateInputDocument> = req.body;

        //@ts-ignore
        const loggedInUserInfo = req.user;

        const id = req.body.id;

        const query = {
            _id: id,
            certificates: {
                $elemMatch: {
                    "certificateId": updateData.certificateId
                }
            }
        };

        const userInfo: any = await getUserInfoByFilterQuery(query);

        if (!userInfo) {
            const customError: any = new Error("Invalid employee info!");
            customError.statusCode = 400;
            throw customError;
        }

        const s3BucketUrl = config.get<string>("USER_PROFILE_DOC_S3_BUCKET_URL");

        const machedCertificateInfo: any = await getCertificateInfo(userInfo.certificates, updateData.certificateId);

        if (machedCertificateInfo) {
            const removeUserInfo = await User.updateOne(query, { $pull: { certificates: { certificateId: updateData.certificateId } } });

            //unlink certificate attachment from s3
            if (_.size(machedCertificateInfo)) await imageOrFileUnlink(s3BucketUrl + "/" + machedCertificateInfo.attachment);
        }

        return userInfo;

    } catch (err: any) {
        throw err;
    }
};

export const getCertificateInfo = async (certificates: any, certificateId: any) => {
    const certificateInfo = await _.find(certificates, (certificateInfo) => {
        if (certificateInfo && certificateInfo.certificateId.toString() === certificateId) {
            return certificateInfo;
        }
    });

    if (certificateInfo) return certificateInfo;
    else return false;
};