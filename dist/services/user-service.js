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
exports.getCertificateInfo = exports.removeEmployeeCertificateInfo = exports.getMhEmployeeUserList = exports.getUserListForDropDown = exports.getUserList = exports.resetPassword = exports.forgotPassword = exports.login = exports.removeUserInfo = exports.updateUserCertificateInfo = exports.updateUser = exports.updateUserPushNotificationInfo = exports.updateMhUser = exports.createMhUser = exports.createUser = exports.verifyNewUserIdNumber = exports.verifyToken = exports.phoneNumberAlreadyIsNotExists = exports.emailAlreadyIsNotExists = exports.getToken = exports.comparePassword = exports.createHashPassword = exports.generateRandomPassword = exports.getUsersByFilterQuery = exports.getUserListByFilterQuery = exports.getUserInfoByFilterQuery = exports.getUserInfoById = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const user_model_1 = __importDefault(require("../models/user-model"));
const nano_id_helper_1 = require("../helpers/nano-id-helper");
const pagination_helper_1 = require("../helpers/pagination-helper");
const aws_s3_service_1 = require("./aws-s3-service");
const skill_service_1 = require("./skill-service");
const source_service_1 = require("./source-service");
const position_service_1 = require("./position-service");
const push_notification_service_1 = require("./push-notification-service");
//pull user info by userId if exists
const getUserInfoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield user_model_1.default.findById(id);
    }
    catch (err) {
        throw err;
    }
});
exports.getUserInfoById = getUserInfoById;
//getting user info by filter query
const getUserInfoByFilterQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield user_model_1.default.findOne(query);
    }
    catch (err) {
        throw err;
    }
});
exports.getUserInfoByFilterQuery = getUserInfoByFilterQuery;
//getting user list by filter query
const getUserListByFilterQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield user_model_1.default.find(query);
    }
    catch (err) {
        throw err;
    }
});
exports.getUserListByFilterQuery = getUserListByFilterQuery;
//getting user info by filter query
const getUsersByFilterQuery = (query, fileds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedFileds = {};
        if (fileds)
            selectedFileds = fileds;
        return yield user_model_1.default.find(query, selectedFileds);
    }
    catch (err) {
        throw err;
    }
});
exports.getUsersByFilterQuery = getUsersByFilterQuery;
//Random Password Generation
const generateRandomPassword = (noOfCharacter) => __awaiter(void 0, void 0, void 0, function* () {
    return Math.random().toString(36).slice(-noOfCharacter);
});
exports.generateRandomPassword = generateRandomPassword;
//Generate Hashed Password With Salts
const createHashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(config_1.default.get("SALT_ROUNDS"));
    return yield bcrypt_1.default.hash(password, salt);
});
exports.createHashPassword = createHashPassword;
//Compare Given Passwords
const comparePassword = (password, hashPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(password, hashPassword);
});
exports.comparePassword = comparePassword;
const getToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    //set some information of user for token generate
    const userToken = lodash_1.default.pick(user, [
        "_id", "name", "email", "userIdNumber", "phoneNumber", "role", "position", "profileCompleted", "profilePicture", "cv", "verified", "active",
        "employee", "client", "admin", "hr", "gender", "dateOfBirth", "presentAddress", "permanentAddress", "language", "higherEducation",
        "licensesNo", "certificationsName", "emmergencyContact", "skill", "countryName", "countryCode", "sourceId", "referPersonName",
        "restaurantName", "restaurantAddress", "employeeExperience", "rating", "totalWorkingHour", "isReferPerson", "isHired", "hiredFromDate",
        "hiredToDate", "hiredBy", "menuPermission", "isMhEmployee", "languages", "clientDiscount", "lat", "long", "hiredByLat", "hiredByLong", "hiredByRestaurantName", "hiredByRestaurantAddress"
    ]);
    return yield generateToken(userToken);
});
exports.getToken = getToken;
//Generate Token
const generateToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.sign(user, config_1.default.get("JWT_SECRET"), { expiresIn: '7d' });
});
//Check if an email already exist in Database
const emailAlreadyIsNotExists = (email, id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = { email: email };
    if (id)
        query._id = { $ne: id };
    const user = yield (0, exports.getUserInfoByFilterQuery)(query);
    if (user) {
        const customError = new Error("Sorry, this email already exists!. Please enter a new email.");
        customError.statusCode = 400;
        throw customError;
    }
    else
        return true;
});
exports.emailAlreadyIsNotExists = emailAlreadyIsNotExists;
//Check if an phone number already exist in Database
const phoneNumberAlreadyIsNotExists = (phone, id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = { phoneNumber: phone };
    if (id)
        query._id = { $ne: id };
    const user = yield (0, exports.getUserInfoByFilterQuery)(query);
    if (user) {
        const customError = new Error("Sorry, this Phone number already exists!. Please enter a new email.");
        customError.statusCode = 400;
        throw customError;
    }
    else
        return true;
});
exports.phoneNumberAlreadyIsNotExists = phoneNumberAlreadyIsNotExists;
//Verify user token
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const splitedToken = token ? token.split('Bearer ') : '';
    const user = splitedToken && splitedToken[1] ? jsonwebtoken_1.default.verify(splitedToken[1], config_1.default.get("JWT_SECRET")) : false;
    let customError = {};
    if (!user) {
        customError = new Error("Bad token format!");
        customError.statusCode = 400;
        throw customError;
    }
    const userInfo = (user && user._id) ? yield (0, exports.getUserInfoByFilterQuery)({ _id: user._id, active: true }) : false;
    if (userInfo)
        return userInfo;
    else {
        customError = new Error("Invalid token!");
        customError.statusCode = 400;
        throw customError;
    }
});
exports.verifyToken = verifyToken;
//pull user info according to id number if exists in the database.
const verifyNewUserIdNumber = (userIdNumber, session) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, exports.getUserInfoByFilterQuery)({ userIdNumber: userIdNumber });
        if (user) {
            // const newUserIdNumber = await generateNewNanoId(true, 7, "QT-");
            //generate new user id number
            let nanoidGenrateKey;
            if (user.client)
                nanoidGenrateKey = "C";
            else if (user.client)
                nanoidGenrateKey = "E";
            let newUserIdNumber = yield (0, nano_id_helper_1.generateNewNanoId)(true, 7, nanoidGenrateKey);
            yield (0, exports.verifyNewUserIdNumber)(newUserIdNumber);
        }
        else {
            return userIdNumber;
        }
    }
    catch (err) {
        throw err;
    }
});
exports.verifyNewUserIdNumber = verifyNewUserIdNumber;
const getSkillRelatedInfo = (skills) => __awaiter(void 0, void 0, void 0, function* () {
    const skillIds = lodash_1.default.compact(lodash_1.default.uniq(skills));
    const newSkills = [];
    const skillListInfo = yield (0, skill_service_1.getSkillListByFilterQuery)({ _id: { $in: skillIds }, active: true });
    if (lodash_1.default.size(skillListInfo) !== lodash_1.default.size(skillIds)) {
        const customError = new Error("Invalid skill info!");
        customError.statusCode = 400;
        throw customError;
    }
    yield Promise.all(lodash_1.default.map(skillListInfo, (skillInfo) => __awaiter(void 0, void 0, void 0, function* () {
        newSkills.push({ skillId: skillInfo._id, skillName: skillInfo.name });
    })));
    return lodash_1.default.size(newSkills) ? newSkills : [];
});
//Add user to Database
const createUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        input.email = input.email.toLowerCase();
        input.emailVerified = false;
        input.phoneNumberVerified = true;
        input.verified = false;
        //generate new user id number
        let nanoidGenrateKey;
        if (input.client) {
            nanoidGenrateKey = "C";
            input.password = yield (0, exports.createHashPassword)(input.password);
        }
        else if (input.employee) {
            nanoidGenrateKey = "E";
            const generatePassword = yield (0, nano_id_helper_1.generateNewNanoId)(true, 6, "P");
            input.password = yield (0, exports.createHashPassword)(generatePassword);
            input.plainPassword = generatePassword;
            input.name = input.firstName + " " + input.lastName;
            const positionInfo = yield (0, position_service_1.getPositionInfoByFilterQuery)({ _id: req.body.positionId, active: true });
            if (!positionInfo) {
                const customError = new Error("Invalid position info!");
                customError.statusCode = 400;
                throw customError;
            }
            input.positionName = positionInfo.name;
        }
        let newUserIdNumber = yield (0, nano_id_helper_1.generateNewNanoId)(true, 7, nanoidGenrateKey);
        //Verify new user id number
        const verifyNanoId = yield (0, exports.verifyNewUserIdNumber)(newUserIdNumber);
        input.userIdNumber = verifyNanoId;
        const addUserInfo = yield user_model_1.default.create(input);
        if (addUserInfo && input) {
            const notificationData = {};
            if (input.client) {
                notificationData.title = 'New Client Registered';
                notificationData.body = `${input.restaurantName} restaurant registered `;
            }
            else if (input.employee) {
                notificationData.title = 'New Employee Registered';
                notificationData.body = `${input.name} registered as a ${input.positionName}`;
            }
            yield (0, push_notification_service_1.getUserInfoBasedOnPushNotificationInfo)({ email: config_1.default.get("ADMIN_PUSH_NOTIFICATION_EMAIL") }, notificationData);
        }
        return addUserInfo;
    }
    catch (err) {
        // If an any error when create to techpack trim info then unlinked user profile from aws s3
        if (lodash_1.default.size(req.body.unlinkArray))
            yield (0, aws_s3_service_1.multipleImageOrFileUnlink)(req.body.unlinkArray);
        throw err;
    }
});
exports.createUser = createUser;
//Add MH user to Database
const createMhUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        //set user menu permission
        let permissions = {};
        if (lodash_1.default.size(input.permissions)) {
            yield Promise.all(lodash_1.default.map(input.permissions, (item) => __awaiter(void 0, void 0, void 0, function* () {
                if (item === "POSITION")
                    permissions.position = true;
                if (item === "SKILL")
                    permissions.skill = true;
                if (item === "SOURCE")
                    permissions.source = true;
                if (item === "EMPLOYEE_LIST")
                    permissions.employeeList = true;
                if (item === "CLIENT_LIST")
                    permissions.clientList = true;
                if (item === "CLIENT_EMPLOYEE_LIST")
                    permissions.clientEmployeeList = true;
                if (item === "MH_EMPLOYEE_LIST")
                    permissions.mhEmployeeList = true;
                if (item === "ADD_MH_EMPLOYEE")
                    permissions.addMhEmployee = true;
            })));
        }
        if (input.role === "ADMIN")
            input.admin = true;
        if (input.role === "HR")
            input.hr = true;
        if (input.role === "MARKETING")
            input.marketing = true;
        input.menuPermission = permissions;
        input.emailVerified = false;
        input.phoneNumberVerified = true;
        input.verified = false;
        input.plainPassword = input.password;
        input.password = yield (0, exports.createHashPassword)(input.password);
        let newUserIdNumber = yield (0, nano_id_helper_1.generateNewNanoId)(true, 7, "MHE");
        //Verify new user id number
        const verifyNanoId = yield (0, exports.verifyNewUserIdNumber)(newUserIdNumber);
        input.userIdNumber = verifyNanoId;
        return yield user_model_1.default.create(input);
    }
    catch (err) {
        throw err;
    }
});
exports.createMhUser = createMhUser;
//Update MH user to Database
const updateMhUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        const mhUserInfo = yield (0, exports.getUserInfoById)(req.body.id);
        if (!mhUserInfo) {
            const customError = new Error("Invalid user info!");
            customError.statusCode = 400;
            throw customError;
        }
        //set user menu permission
        let permissions = {};
        if (lodash_1.default.size(input.permissions)) {
            yield Promise.all(lodash_1.default.map(input.permissions, (item) => __awaiter(void 0, void 0, void 0, function* () {
                if (item === "POSITION")
                    permissions.position = true;
                if (item === "SKILL")
                    permissions.skill = true;
                if (item === "SOURCE")
                    permissions.source = true;
                if (item === "EMPLOYEE_LIST")
                    permissions.employeeList = true;
                if (item === "CLIENT_LIST")
                    permissions.clientList = true;
                if (item === "CLIENT_EMPLOYEE_LIST")
                    permissions.clientEmployeeList = true;
                if (item === "MH_EMPLOYEE_LIST")
                    permissions.mhEmployeeList = true;
                if (item === "ADD_MH_EMPLOYEE")
                    permissions.addMhEmployee = true;
            })));
        }
        if (input.role === "ADMIN")
            input.admin = true;
        if (input.role === "HR")
            input.hr = true;
        if (input.role === "MARKETING")
            input.marketing = true;
        input.menuPermission = permissions;
        return yield user_model_1.default.updateOne({ _id: req.body.id }, { $set: input });
    }
    catch (err) {
        throw err;
    }
});
exports.updateMhUser = updateMhUser;
//Update user push notification info to Database
const updateUserPushNotificationInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateData = req.body;
        //@ts-ignore
        const loggedInUserInfo = req.user;
        const mhUserInfo = yield (0, exports.getUserInfoById)(loggedInUserInfo._id);
        if (!mhUserInfo) {
            const customError = new Error("Invalid user info!");
            customError.statusCode = 400;
            throw customError;
        }
        const setData = { pushNotificationDetails: { uuid: updateData.uuid, fcmToken: updateData.fcmToken, platform: updateData.platform } };
        return yield user_model_1.default.updateOne({ _id: loggedInUserInfo._id }, { $set: setData });
    }
    catch (err) {
        throw err;
    }
});
exports.updateUserPushNotificationInfo = updateUserPushNotificationInfo;
//update user info according to user id.
const updateUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateData = req.body;
        const userInfo = yield (0, exports.getUserInfoById)(req.body.id);
        if (!userInfo) {
            const customError = new Error("Invalid User info!");
            customError.statusCode = 400;
            throw customError;
        }
        const user = new user_model_1.default(userInfo);
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
        if (lodash_1.default.size(updateData.languages)) {
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
        if (lodash_1.default.size(updateData.skills)) {
            isChanged = true;
            user.skills = yield getSkillRelatedInfo(updateData.skills);
        }
        if (updateData.positionId || userInfo.positionId.toString() !== updateData.positionId) {
            const positionInfo = yield (0, position_service_1.getPositionInfoByFilterQuery)({ _id: updateData.positionId, active: true });
            if (!positionInfo) {
                const customError = new Error("Invalid position info!");
                customError.statusCode = 400;
                throw customError;
            }
            isChanged = true;
            user.positionId = updateData.positionId;
            user.positionName = positionInfo.name;
        }
        // console.log("userInfo.sourceId.toString(); ", userInfo.sourceId);
        if (updateData.sourceId || userInfo.sourceId && userInfo.sourceId.toString() !== updateData.sourceId) {
            const sourceInfo = yield (0, source_service_1.getSourceInfoByFilterQuery)({ _id: updateData.sourceId, active: true });
            if (!sourceInfo) {
                const customError = new Error("Invalid source info!");
                customError.statusCode = 400;
                throw customError;
            }
            isChanged = true;
            user.sourceId = updateData.sourceId;
            user.sourceName = sourceInfo.name;
        }
        if (updateData.referPersonId || userInfo.referPersonId && userInfo.referPersonId.toString() !== updateData.referPersonId) {
            const userInfo = yield (0, exports.getUserInfoById)(req.body.referPersonId);
            if (!userInfo) {
                const customError = new Error("Invalid refer person info!");
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
        const s3BucketUrl = req.body.s3BucketUrl;
        const unlinkedArray = [];
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
            user.password = yield (0, exports.createHashPassword)(updateData.password);
        }
        if (isChanged) {
            const updateUser = yield user.save();
            if (lodash_1.default.size(unlinkedArray))
                yield (0, aws_s3_service_1.multipleImageOrFileUnlink)(unlinkedArray);
            return updateUser;
        }
    }
    catch (err) {
        // If an any error when create to techpack trim info then unlinked user profile from aws s3
        if (lodash_1.default.size(req.body.unlinkArray))
            yield (0, aws_s3_service_1.multipleImageOrFileUnlink)(req.body.unlinkArray);
        throw err;
    }
});
exports.updateUser = updateUser;
//update user certificate info
const updateUserCertificateInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let updateData = req.body;
        //@ts-ignore
        const loggedInUserInfo = req.user;
        const id = req.body.id;
        const userInfo = yield (0, exports.getUserInfoById)(req.body.id);
        if (!userInfo) {
            const customError = new Error("Invalid User info!");
            customError.statusCode = 400;
            throw customError;
        }
        let setOrAddTosetData = {};
        let query = { _id: id };
        const s3BucketUrl = req.body.s3BucketUrl;
        const unlinkedArray = [];
        if (updateData.certificateId) {
            query["certificates"] = {
                $elemMatch: {
                    "certificateId": updateData.certificateId
                }
            };
            const certificates = userInfo.certificates;
            const matchedCertificateInfo = lodash_1.default.find(certificates, (certificateInfo) => {
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
        }
        else {
            updateData.certificateId = new mongoose_1.default.Types.ObjectId();
            const newSketchData = {
                certificateId: updateData.certificateId,
                certificateName: updateData.certificateName,
                attachment: updateData.attachment
            };
            setOrAddTosetData = { $addToSet: { certificates: newSketchData } };
        }
        if (lodash_1.default.size(setOrAddTosetData))
            yield user_model_1.default.updateOne(query, setOrAddTosetData);
        return updateData;
    }
    catch (err) {
        // If an any error when create to techpack trim info then unlinked user profile from aws s3
        if (lodash_1.default.size(req.body.unlinkArray))
            yield (0, aws_s3_service_1.multipleImageOrFileUnlink)(req.body.unlinkArray);
        throw err;
    }
});
exports.updateUserCertificateInfo = updateUserCertificateInfo;
//remove user info and related info
const removeUserInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = { _id: req.body.id };
        const userInfo = yield (0, exports.getUserInfoByFilterQuery)(query);
        if (!userInfo) {
            const customError = new Error("Invalid User info");
            customError.statusCode = 400;
            throw customError;
        }
        return yield user_model_1.default.updateOne(query, { $set: { deleted: true, active: false } });
    }
    catch (err) {
        throw err;
    }
});
exports.removeUserInfo = removeUserInfo;
//Check login credentials with database 
const login = (loginData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginQuery = {};
        let errorMessage = "";
        if (loginData.email) {
            errorMessage = "You provided email and password combination didn't match!";
            loginQuery.email = loginData.email;
        }
        else if (loginData.userIdNumber) {
            errorMessage = "You provided user id number and password combination didn't match!";
            loginQuery.userIdNumber = loginData.userIdNumber;
        }
        let customError = {};
        if (!lodash_1.default.size(loginQuery)) {
            customError = new Error("Please enter your registered email/user id number and password");
            customError.statusCode = 400;
            throw customError;
        }
        const user = yield (0, exports.getUserInfoByFilterQuery)(loginQuery);
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
        if (yield (0, exports.comparePassword)(loginData.password, user.password)) {
            return yield (0, exports.getToken)(user);
        }
        else {
            customError = new Error("The password you provided didn't match with our records!");
            customError.statusCode = 400;
            throw customError;
        }
    }
    catch (err) {
        throw err;
    }
});
exports.login = login;
//user can give email or password and otp will be sent to that medium
const forgotPassword = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        let customError = {};
        let errorMessage = '';
        const query = {};
        if (input.email) {
            query.email = input.email;
            const emailOtpInfo = { email: req.body.email, otpType: "email" };
            req.body = emailOtpInfo;
            errorMessage = "Invalid email address!";
        }
        if (input.userIdNumber) {
            query.userIdNumber = input.userIdNumber;
            const phoneOtpInfo = { userIdNumber: req.body.userIdNumber, otpType: "phone" };
            req.body = phoneOtpInfo;
            errorMessage = "Invalid phone number!";
        }
        if (!lodash_1.default.size(query)) {
            customError = new Error(errorMessage);
            customError.statusCode = 400;
            throw customError;
        }
        const user = yield (0, exports.getUserInfoByFilterQuery)(query);
        if (!user) {
            customError = new Error("Invalid email/user id number!");
            customError.statusCode = 400;
            throw customError;
        }
        req.body.name = user.name;
        const createdBy = user._id;
    }
    catch (err) {
        throw err;
    }
});
exports.forgotPassword = forgotPassword;
//otp and new password will be given by the user.
//check the otp and update the password
const resetPassword = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let customError = {};
        let errorMessage = '';
        let OtpVerified = false;
        const query = {};
        if (req.body.email) {
            query.email = req.body.email;
            errorMessage = "Invalid email!";
        }
        if (req.body.userIdNumber) {
            query.userIdNumber = req.body.userIdNumber;
            errorMessage = "Invalid user id number!";
        }
        if (!lodash_1.default.size(query)) {
            customError = new Error(errorMessage);
            customError.statusCode = 400;
            throw customError;
        }
        const user = yield (0, exports.getUserInfoByFilterQuery)(query);
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
        return yield (0, exports.updateUser)(req);
    }
    catch (err) {
        throw err;
    }
});
exports.resetPassword = resetPassword;
//Get All Reader API
const getUserList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pagination = yield (0, pagination_helper_1.getPagination)(req);
        const query = { isMhEmployee: false };
        let { active, positionId, rating, employeeExperience, minTotalHour, maxTotalHour, isReferPerson, requestType, viewType, mhEmployee, fromDate, toDate } = req.query;
        const searchKeyword = req.query.searchKeyword;
        if (active === "YES")
            query.active = true;
        else if (active === "NO")
            query.active = false;
        if (isReferPerson === "YES")
            query.isReferPerson = true;
        else if (isReferPerson === "NO")
            query.isReferPerson = false;
        if (positionId) {
            const positionId = req.query.positionId;
            query.positionId = new mongoose_1.default.Types.ObjectId(positionId);
        }
        if (rating)
            query.rating = rating;
        if (employeeExperience)
            query.employeeExperience = employeeExperience;
        if (minTotalHour)
            query.totalWorkingHour = minTotalHour;
        if (maxTotalHour)
            query.totalWorkingHour = maxTotalHour;
        if (minTotalHour && maxTotalHour)
            query.totalWorkingHour = { $lte: minTotalHour, $gte: maxTotalHour };
        if (requestType && requestType === "EMPLOYEE")
            query.employee = true;
        else if (requestType && requestType === "CLIENT")
            query.client = true;
        else if (requestType && requestType === "HR")
            query.hr = true;
        else if (requestType && requestType === "ADMIN")
            query.admin = true;
        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }
        if (viewType === "public") {
            // based on viewType some fields assign here
            query.active = true;
        }
        if (fromDate) {
            fromDate = (0, moment_1.default)(fromDate).startOf('day').toDate();
            toDate = toDate ? (0, moment_1.default)(toDate).endOf('day').toDate() : (0, moment_1.default)().endOf('day').toDate();
            const formateFromDate = (0, moment_1.default)(fromDate).format('YYYY-MM-DD');
            const formateToDate = (0, moment_1.default)(toDate).format('YYYY-MM-DD');
            if (formateFromDate > formateToDate)
                toDate = fromDate;
            query.createdAt = { $gte: fromDate, $lte: toDate };
        }
        else if (!fromDate && toDate) {
            fromDate = (0, moment_1.default)().startOf('day').toDate();
            toDate = (0, moment_1.default)().endOf('day').toDate();
            query.createdAt = { $gte: fromDate, $lte: toDate };
        }
        if (req.query.skipLimit === "YES")
            pagination = { sort: pagination.sort };
        const users = yield user_model_1.default.find(query, {}, pagination);
        const totalUsers = yield user_model_1.default.find(query).count();
        return {
            total: totalUsers,
            count: users.length,
            next: users.length === pagination.limit ? pagination.skip + pagination.limit : null,
            users
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getUserList = getUserList;
//get list for dropdown 
const getUserListForDropDown = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pagination = yield (0, pagination_helper_1.getPagination)(req);
        pagination.sort = { name: 1 };
        const query = { active: true, isMhEmployee: false };
        const searchKeyword = req.query.searchKeyword;
        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }
        const users = yield user_model_1.default.find(query, { name: 1 }, pagination);
        return {
            count: users.length,
            next: users.length === pagination.limit ? pagination.skip + pagination.limit : null,
            users
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getUserListForDropDown = getUserListForDropDown;
//get mh employee user info
const getMhEmployeeUserList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pagination = yield (0, pagination_helper_1.getPagination)(req);
        const query = { isMhEmployee: true };
        const { active } = req.query;
        const searchKeyword = req.query.searchKeyword;
        if (active === "YES")
            query.active = true;
        else if (active === "NO")
            query.active = false;
        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }
        const users = yield user_model_1.default.find(query, { name: 1, email: 1, phoneNumber: 1, role: 1, active: 1, plainPassword: 1 }, pagination);
        const totalUsers = yield user_model_1.default.find(query).count();
        return {
            total: totalUsers,
            count: users.length,
            next: users.length === pagination.limit ? pagination.skip + pagination.limit : null,
            users
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getMhEmployeeUserList = getMhEmployeeUserList;
//removed employee certificate info
const removeEmployeeCertificateInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateData = req.body;
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
        const userInfo = yield (0, exports.getUserInfoByFilterQuery)(query);
        if (!userInfo) {
            const customError = new Error("Invalid employee info!");
            customError.statusCode = 400;
            throw customError;
        }
        const s3BucketUrl = config_1.default.get("USER_PROFILE_DOC_S3_BUCKET_URL");
        const machedCertificateInfo = yield (0, exports.getCertificateInfo)(userInfo.certificates, updateData.certificateId);
        if (machedCertificateInfo) {
            const removeUserInfo = yield user_model_1.default.updateOne(query, { $pull: { certificates: { certificateId: updateData.certificateId } } });
            //unlink certificate attachment from s3
            if (lodash_1.default.size(machedCertificateInfo))
                yield (0, aws_s3_service_1.imageOrFileUnlink)(s3BucketUrl + "/" + machedCertificateInfo.attachment);
        }
        return userInfo;
    }
    catch (err) {
        throw err;
    }
});
exports.removeEmployeeCertificateInfo = removeEmployeeCertificateInfo;
const getCertificateInfo = (certificates, certificateId) => __awaiter(void 0, void 0, void 0, function* () {
    const certificateInfo = yield lodash_1.default.find(certificates, (certificateInfo) => {
        if (certificateInfo && certificateInfo.certificateId.toString() === certificateId) {
            return certificateInfo;
        }
    });
    if (certificateInfo)
        return certificateInfo;
    else
        return false;
});
exports.getCertificateInfo = getCertificateInfo;
