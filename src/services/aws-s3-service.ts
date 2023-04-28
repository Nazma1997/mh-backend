
import aws from "aws-sdk";
import config from "config";
import _ from "lodash";

// set S3 secret key and access key id
const s3 = new aws.S3({
    secretAccessKey: config.get<string>("S3_SECRET_ACCESS_KEY"),
    accessKeyId: config.get<string>("S3_ACCESS_KEY_ID"),
    region: config.get<string>('S3_REGION')
});

// single file or image unlink from s3
export const imageOrFileUnlink = async (key: String) => {
    try {

        const params: any = {
            Bucket: config.get<string>("S3_BUCKET_NAME"),
            Key: key
        };

        return await s3.deleteObject(params).promise();

    } catch (err: any) {

        throw err;
    }
};

// multiple imgae or file unlink from s3
export const multipleImageOrFileUnlink = async (deletedArrays: Array<Object>) => {
    try {

        const params: any = {
            Bucket: config.get<string>("S3_BUCKET_NAME"),
            Delete: { Objects: deletedArrays }
        };

        return await s3.deleteObjects(params).promise();

    } catch (err: any) {
        throw err;
    }
};

export const copyImagesOrFilesFromS3 = async (copyArrays: any) => {
    try {
        const bucketName: any = config.get<string>("S3_BUCKET_NAME");

        return await Promise.all(_.map(copyArrays, async (item: any) => {

            let params: any = {
                Bucket: bucketName,
                CopySource: item.oldKey,
                Key: item.newKey
            };

            if (item && item.acl) params.ACL = item.acl;

            if (item.oldKey && item.newKey) await s3.copyObject(params).promise();

        }));

    } catch (err: any) {
        throw err;
    }
};