import { Request } from "express";
import { DocumentDefinition, ObjectId } from "mongoose";

import _ from "lodash";

import AppError, { AppErrorDocument } from "../models/app-error-model";
import { getUserInfoById } from "./user-service";

//pull AppError info by AppError id if exists
export const getAppErrorInfoById = async (id: ObjectId) => {
    try {
        return await AppError.findById(id);
    } catch (err: any) {
        throw err;
    }
};

//Add AppError to Database
export const addAppErrorInfo = async (req: Request) => {
    try {
        const input: DocumentDefinition<AppErrorDocument> = req.body;

        if (req.body.userId) {
            const userInfo: any = await getUserInfoById(req.body.userId);

            if (!userInfo) {
                const customError: any = new Error("Invalid user info.");
                customError.statusCode = 400;
                throw customError;
            }

            input.createdBy = input.userId;
        }

        return await AppError.create(input);

    } catch (err: any) {
        throw err;
    }
};

//remove AppError info and related info
export const deleteAppErrorInfo = async (req: Request) => {
    try {

        const id: any = req.params.id;

        const appErrorInfo: any = await getAppErrorInfoById(id);

        if (!appErrorInfo) {
            const customError: any = new Error("Invalid app error info");
            customError.statusCode = 400;
            throw customError;
        }

        return await AppError.deleteOne({ _id: id });

    } catch (err: any) {
        throw err;
    }
};

//get app error list 
export const getAppErrorList = async (req: Request) => {
    try {

        const appErrors = await AppError.find();

        return {
            count: appErrors.length,
            appErrors
        };

    } catch (err: any) {
        throw err;
    }
};