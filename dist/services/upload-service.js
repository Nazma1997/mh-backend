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
exports.privateImageOrFileUpload = exports.imageOrFileUpload = void 0;
const lodash_1 = __importDefault(require("lodash"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const shortid_1 = __importDefault(require("shortid"));
const config_1 = __importDefault(require("config"));
const common_helper_1 = require("../helpers/common-helper");
// const s3CredentialUpdate = async () => {
//     aws.config.update({
//         secretAccessKey: S3_SECRET_ACCESS_KEY,
//         accessKeyId: S3_ACCESS_KEY_ID,
//         region: "us-east-2",
//     });
// };
//s3CredentialUpdate();
//set S3 secret key and access key id
const s3 = new aws_sdk_1.default.S3({
    secretAccessKey: config_1.default.get("S3_SECRET_ACCESS_KEY"),
    accessKeyId: config_1.default.get("S3_ACCESS_KEY_ID")
});
//define allowed file types
const allowedFileTypes = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/pdf"
];
//define allowed image types
const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif"
];
const fileFieldNames = [
    "files",
    "file"
];
const imageFieldNames = [
    "images",
    "image"
];
//validate image mime types or file types
//with validate image/file extension
const checkValidType = (req, file, cb) => {
    // if ((_.indexOf(imageFieldNames, file.fieldname) !== -1 && _.indexOf(allowedImageTypes, file.mimetype) !== -1) || 
    //     (_.indexOf(fileFieldNames, file.fieldname) !== -1 && _.indexOf(allowedFileTypes, file.mimetype) !== -1))
    if ((lodash_1.default.indexOf(allowedImageTypes, file.mimetype) !== -1) ||
        (lodash_1.default.indexOf(allowedFileTypes, file.mimetype) !== -1)) {
        cb(null, true);
    }
    else {
        const errorMessage = "Invalid file type, only pdf, doc, JPEG, JPG, PNG and GIF are allowed!";
        cb(new Error(errorMessage), false);
    }
};
const getS3BucketName = (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
    let bucketName = config_1.default.get("S3_BUCKET_NAME");
    //@ts-ignore
    if (req && req.bucketType === "user_profile") {
        bucketName += "/" + config_1.default.get("USER_PROFILE_DOC_S3_BUCKET_URL");
    }
    else {
        bucketName += "/public";
    }
    cb(null, bucketName);
});
exports.imageOrFileUpload = (0, multer_1.default)({
    limits: { fileSize: config_1.default.get("MAX_UPLOAD_SIZE") },
    fileFilter: checkValidType,
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
            yield getS3BucketName(req, file, cb);
        }),
        acl: "public-read",
        contentType: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
            cb(null, file.mimetype);
        }),
        metadata: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
            cb(null, { fieldName: file.fieldname });
        }),
        key: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
            cb(null, shortid_1.default.generate() + "-" + (yield (0, common_helper_1.getStringWithoutSpecialCharacters)(file.originalname)));
        })
    })
});
exports.privateImageOrFileUpload = (0, multer_1.default)({
    limits: { fileSize: config_1.default.get("MAX_UPLOAD_SIZE") },
    fileFilter: checkValidType,
    storage: (0, multer_s3_1.default)({
        s3: s3,
        bucket: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
            yield getS3BucketName(req, file, cb);
        }),
        contentType: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
            cb(null, file.mimetype);
        }),
        metadata: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
            cb(null, { fieldName: file.fieldname });
        }),
        key: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
            cb(null, shortid_1.default.generate() + "-" + (yield (0, common_helper_1.getStringWithoutSpecialCharacters)(file.originalname)));
        })
    })
});
