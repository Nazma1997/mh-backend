import _ from "lodash";
import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import shortid from "shortid";

import config from "config";

import { getStringWithoutSpecialCharacters } from "../helpers/common-helper";

// const s3CredentialUpdate = async () => {
//     aws.config.update({
//         secretAccessKey: S3_SECRET_ACCESS_KEY,
//         accessKeyId: S3_ACCESS_KEY_ID,
//         region: "us-east-2",
//     });
// };

//s3CredentialUpdate();

//set S3 secret key and access key id
const s3: any = new aws.S3({
    secretAccessKey: config.get<string>("S3_SECRET_ACCESS_KEY"),
    accessKeyId: config.get<string>("S3_ACCESS_KEY_ID")
});

//define allowed file types
const allowedFileTypes: Array<string> = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/pdf"
];

//define allowed image types
const allowedImageTypes: Array<string> = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif"
];

const fileFieldNames: Array<string> = [
    "files",
    "file"
];

const imageFieldNames: Array<string> = [
    "images",
    "image"
];

//validate image mime types or file types
//with validate image/file extension
const checkValidType = (req: Express.Request, file: Express.Multer.File, cb: any) => {

    // if ((_.indexOf(imageFieldNames, file.fieldname) !== -1 && _.indexOf(allowedImageTypes, file.mimetype) !== -1) || 
    //     (_.indexOf(fileFieldNames, file.fieldname) !== -1 && _.indexOf(allowedFileTypes, file.mimetype) !== -1))

    if ((_.indexOf(allowedImageTypes, file.mimetype) !== -1) ||
        (_.indexOf(allowedFileTypes, file.mimetype) !== -1)) {

        cb(null, true);

    } else {

        const errorMessage = "Invalid file type, only pdf, doc, JPEG, JPG, PNG and GIF are allowed!";

        cb(new Error(errorMessage), false);
    }
};

const getS3BucketName = async (req: Express.Request, file: Express.Multer.File, cb: any) => {
    let bucketName = config.get<string>("S3_BUCKET_NAME");

    //@ts-ignore
    if (req && req.bucketType === "user_profile") {
        
        bucketName += "/" + config.get<string>("USER_PROFILE_DOC_S3_BUCKET_URL");
    } else {
        bucketName += "/public"
    }

    cb(null, bucketName);
};

export const imageOrFileUpload: any = multer({
    limits: { fileSize: config.get<number>("MAX_UPLOAD_SIZE") },
    fileFilter: checkValidType,
    storage: multerS3({
        s3: s3,
        bucket: async (req: Express.Request, file: Express.Multer.File, cb: any) => {
            await getS3BucketName(req, file, cb);
        },
        acl: "public-read",
        contentType: async (req: Express.Request, file: Express.Multer.File, cb: any) => {
            cb(null, file.mimetype);
        },
        metadata: async (req: Express.Request, file: Express.Multer.File, cb: any) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: async (req: Express.Request, file: Express.Multer.File, cb: any) => {
            cb(null, shortid.generate() + "-" + await getStringWithoutSpecialCharacters(file.originalname));
        }
    })
});

export const privateImageOrFileUpload: any = multer({
    limits: { fileSize: config.get<number>("MAX_UPLOAD_SIZE") },
    fileFilter: checkValidType,
    storage: multerS3({
        s3: s3,
        bucket: async (req: Express.Request, file: Express.Multer.File, cb: any) => {
            await getS3BucketName(req, file, cb);
        },
        contentType: async (req: Express.Request, file: Express.Multer.File, cb: any) => {
            cb(null, file.mimetype);
        },
        metadata: async (req: Express.Request, file: Express.Multer.File, cb: any) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: async (req: Express.Request, file: Express.Multer.File, cb: any) => {
            cb(null, shortid.generate() + "-" + await getStringWithoutSpecialCharacters(file.originalname));
        }
    })
});