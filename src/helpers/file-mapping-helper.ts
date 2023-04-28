import { Request } from "express";

import _ from 'lodash';

//Take the location from uploaded files and assign them dynamically to request body
export const filesMappingHelper = async (req: Request): Promise<Request> => {

    let unlinkArray: any = [];

    const s3BucketUrl: String = req.body.s3BucketUrl ? req.body.s3BucketUrl : null;
    const files: any = req.files;

    await Promise.all(_.map(files, async function (value: any, key: string) {

        const currentKey: any = key;
        let images: Array<String> = [];

        await Promise.all(_.map(value, async (value: any, key: string) => {

            images = [...images, value.key];
            unlinkArray.push({ Key: s3BucketUrl + "/" + value.key });
        }));

        req.body[`${currentKey}`] = images;
    }));

    if (_.size(unlinkArray) && s3BucketUrl) req.body.unlinkArray = unlinkArray;

    return req;
};