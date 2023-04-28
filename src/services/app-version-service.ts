import { Request } from "express";
import { DocumentDefinition, ObjectId } from "mongoose";

import _ from "lodash";

import AppVersion, { AppVersionDocument } from "../models/app-version-model";


export const getAppErrorInfoById = async (id: ObjectId) => {
    try {
        return await AppVersion.findById(id);
    } catch (err: any) {
        throw err;
    }
};

export const updateAppVersionInfo = async (req: Request) => {
    try {
        const input: DocumentDefinition<AppVersionDocument> = req.body;

        return await AppVersion.updateOne(input);

    } catch (err: any) {
        throw err;
    }
};