import mongoose from "mongoose";
import { RoleTypes } from "../utils/static/enum";

export interface UserTokenDocument {
    _id: mongoose.Types.ObjectId;
    name: String;
    email: String;
    phoneNumber: String;
    verified: Boolean;
    active: Boolean;
    noOfEmployee?: Number;
};

export interface UserInput {
    name: String;
    email: String;
    userIdNumber: String;
    countryCode: String;
    password: string;
    certificateId: mongoose.Types.ObjectId;
    sourceId: mongoose.Types.ObjectId;
    certificateName: String;
    attachment: String;
    profilePicture: String;
    cv: String;
    skills: [typeof SkillItemSchema];
    bankName: String;
    accountNumber: String;
    routingNumber: String;
    dressSize: String;
    additionalOne: String;
    additionalTwo: String;
};

export interface MhUserInput {
    id: mongoose.Types.ObjectId;
    name: String;
    email: String;
    phoneNumber: String;
    password: string;
    plainPassword: string;
    userIdNumber: String;
    role: String;
    permissions: [String];
    menuPermission: typeof PermissionItemSchema;
    isMhEmployee: Boolean;
    verified: Boolean;
    emailVerified: Boolean;
    phoneNumberVerified: Boolean;
    admin: Boolean;
    hr: Boolean;
    marketing: Boolean;
};
export interface UserPushNotificationInput {
    uuid: String;
    fcmToken: String;
    platform: String;
};


export interface UserCertificateInputDocument {
    id: mongoose.Types.ObjectId;
    certificateId: mongoose.Types.ObjectId;
};

export interface UserDocument extends UserInput, mongoose.Document {
    profilePicture: String;
    userIdNumber: String;
    verified: Boolean;
    emailVerified: Boolean;
    phoneNumber: String;
    phoneNumberVerified: Boolean;
    client: Boolean;
    employee: Boolean;
    active: Boolean;
    isReferPerson: Boolean;
    createdAt: Date;
    updatedAt: Date;
    referPersonId: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    plainPassword: String;
    positionName: String;
    referPersonName: String;
    sourceName: String;
    clientDiscount: Number;
    hourlyRate: Number;
    lat: String;
    long: String;
    gender: String;
    dateOfBirth: String;
    countryName: String;
    presentAddress: String;
    permanentAddress: String;
    languages: [String];
    higherEducation: String;
    licensesNo: String;
    emmergencyContact: String;
    positionId: mongoose.Types.ObjectId;
    employeeExperience: String;
    name: String;
    firstName: String;
    lastName: String;
    restaurantName: String;
};

export interface UserStatusDocument {
    id: mongoose.Types.ObjectId;
    active: Boolean;
    createdBy: mongoose.Types.ObjectId;
};

const CertificateSchema = new mongoose.Schema({
    certificateId: mongoose.Types.ObjectId,
    certificateName: String,
    attachment: String
});

const SkillItemSchema = new mongoose.Schema({
    skillId: mongoose.Types.ObjectId,
    skillName: String,
});

const PermissionItemSchema = new mongoose.Schema({
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

const PushNotificationItemSchema = new mongoose.Schema({
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

export const UserSchema = new mongoose.Schema(
    {
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
            type: mongoose.Types.ObjectId,
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
        sourceId: { // how you know about us 
            type: mongoose.Types.ObjectId,
            // required: true,
        },
        sourceName: { // how you know about us 
            type: String,
            // required: true,
        },
        referPersonId: {
            type: mongoose.Types.ObjectId,
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
            enum: RoleTypes,
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
        hiredBy: { // this id is client id
            type: mongoose.Types.ObjectId,
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
            type: mongoose.Types.ObjectId,
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
        clientDiscount: { //For employee hired // discount set by hr or admin
            type: Number,
            default: 0
        },
        profilePicture: String,
        cv: String,
        lat: String,
        long: String,
        menuPermission: PermissionItemSchema, //user menu list
        pushNotificationDetails: PushNotificationItemSchema,
        createdBy: {
            type: mongoose.Types.ObjectId,
        }
    },
    { timestamps: true }
);

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;