"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../utils/static/enum");
;
;
;
;
;
;
;
const CertificateSchema = new mongoose_1.default.Schema({
    certificateId: mongoose_1.default.Types.ObjectId,
    certificateName: String,
    attachment: String
});
const SkillItemSchema = new mongoose_1.default.Schema({
    skillId: mongoose_1.default.Types.ObjectId,
    skillName: String,
});
const PermissionItemSchema = new mongoose_1.default.Schema({
    position: {
        type: Boolean,
        default: false
    },
    skill: {
        type: Boolean,
        default: false
    },
    source: {
        type: Boolean,
        default: false
    },
    employeeList: {
        type: Boolean,
        default: false
    },
    clientList: {
        type: Boolean,
        default: false
    },
    clientEmployeeList: {
        type: Boolean,
        default: false
    },
    mhEmployeeList: {
        type: Boolean,
        default: false
    },
    addMhEmployee: {
        type: Boolean,
        default: false
    },
});
const PushNotificationItemSchema = new mongoose_1.default.Schema({
    uuid: {
        type: String
    },
    fcmToken: {
        type: String
    },
    platform: {
        type: String
    }
});
exports.UserSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    name: {
        type: String,
    },
    positionId: {
        type: mongoose_1.default.Types.ObjectId,
    },
    positionName: {
        type: String,
    },
    gender: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },
    userIdNumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    //Start Bank and dress
    bankName: String,
    accountNumber: String,
    routingNumber: String,
    dressSize: String,
    additionalOne: String,
    additionalTwo: String,
    //End Bank and dress
    presentAddress: String,
    permanentAddress: String,
    languages: [String],
    higherEducation: String,
    licensesNo: String,
    certificates: [CertificateSchema],
    emmergencyContact: String,
    skills: [SkillItemSchema],
    countryName: String,
    countryCode: String,
    password: {
        type: String,
        required: true
    },
    plainPassword: {
        type: String,
        // required: true
    },
    sourceId: {
        type: mongoose_1.default.Types.ObjectId,
        // required: true,
    },
    sourceName: {
        type: String,
        // required: true,
    },
    referPersonId: {
        type: mongoose_1.default.Types.ObjectId,
    },
    referPersonName: {
        type: String,
    },
    restaurantName: {
        type: String,
    },
    restaurantAddress: {
        type: String,
    },
    nidNumber: {
        type: String
    },
    passportNumber: {
        type: String
    },
    emailVerified: {
        type: Boolean,
        required: true
    },
    phoneNumberVerified: {
        type: Boolean,
        required: true
    },
    employee: {
        type: Boolean,
        default: false
    },
    client: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    hr: {
        type: Boolean,
        default: false
    },
    marketing: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: enum_1.RoleTypes,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    isReferPerson: {
        type: Boolean,
        default: false
    },
    isMhEmployee: {
        type: Boolean,
        default: false
    },
    isHired: {
        type: Boolean,
        default: false
    },
    hiredFromDate: {
        type: Date,
    },
    hiredToDate: {
        type: Date,
    },
    hiredBy: {
        type: mongoose_1.default.Types.ObjectId,
    },
    hiredByLat: String,
    hiredByLong: String,
    hiredByRestaurantName: String,
    hiredByRestaurantAddress: String,
    deleted: {
        type: Boolean,
        required: false
    },
    deactivatedReason: {
        type: String,
    },
    deactivatedBy: {
        type: mongoose_1.default.Types.ObjectId,
    },
    verified: {
        type: Boolean,
        default: false
    },
    noOfEmployee: {
        type: Number,
        default: 0
    },
    employeeExperience: {
        type: String,
    },
    rating: {
        type: Number,
        default: 0
    },
    totalWorkingHour: {
        type: Number,
        default: 0
    },
    hourlyRate: {
        type: Number,
        default: 0
    },
    clientDiscount: {
        type: Number,
        default: 0
    },
    profilePicture: String,
    cv: String,
    lat: String,
    long: String,
    menuPermission: PermissionItemSchema,
    pushNotificationDetails: PushNotificationItemSchema,
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
    }
}, { timestamps: true });
const User = mongoose_1.default.model("User", exports.UserSchema);
exports.default = User;
