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
exports.copyImagesOrFilesFromS3 = exports.multipleImageOrFileUnlink = exports.imageOrFileUnlink = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = __importDefault(require("config"));
const lodash_1 = __importDefault(require("lodash"));
//set S3 secret key and access key id
const s3 = new aws_sdk_1.default.S3({
    secretAccessKey: config_1.default.get("S3_SECRET_ACCESS_KEY"),
    accessKeyId: config_1.default.get("S3_ACCESS_KEY_ID"),
    region: config_1.default.get('S3_REGION')
});
// single file or image unlink from s3
const imageOrFileUnlink = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            Bucket: config_1.default.get("S3_BUCKET_NAME"),
            Key: key
        };
        return yield s3.deleteObject(params).promise();
    }
    catch (err) {
        throw err;
    }
});
exports.imageOrFileUnlink = imageOrFileUnlink;
// multiple imgae or file unlink from s3
const multipleImageOrFileUnlink = (deletedArrays) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            Bucket: config_1.default.get("S3_BUCKET_NAME"),
            Delete: { Objects: deletedArrays }
        };
        return yield s3.deleteObjects(params).promise();
    }
    catch (err) {
        throw err;
    }
});
exports.multipleImageOrFileUnlink = multipleImageOrFileUnlink;
const copyImagesOrFilesFromS3 = (copyArrays) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bucketName = config_1.default.get("S3_BUCKET_NAME");
        return yield Promise.all(lodash_1.default.map(copyArrays, (item) => __awaiter(void 0, void 0, void 0, function* () {
            let params = {
                Bucket: bucketName,
                CopySource: item.oldKey,
                Key: item.newKey
            };
            if (item && item.acl)
                params.ACL = item.acl;
            if (item.oldKey && item.newKey)
                yield s3.copyObject(params).promise();
        })));
    }
    catch (err) {
        throw err;
    }
});
exports.copyImagesOrFilesFromS3 = copyImagesOrFilesFromS3;
