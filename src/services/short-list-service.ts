import { Request } from "express";
import mongoose, { DocumentDefinition, FilterQuery, ObjectId } from "mongoose";

import _ from "lodash";

import { getPagination } from "../helpers/pagination-helper";

import ShortList, { ShortListDocument } from "../models/short-list-model";
import { getUserInfoById } from "./user-service";
import { getHiredHistoryInfoByFilterQuery } from "./hired-history-service";

//pull short list info by short list id if exists
export const getShortListInfoById = async (id: ObjectId) => {
    try {
        return await ShortList.findById(id);
    } catch (err: any) {
        throw err;
    }
};

//pull short list by short list filter query if exists
export const getShortListInfoByFilterQuery = async (query: any) => {
    try {
        return await ShortList.findOne(query);
    } catch (err: any) {
        throw err;
    }
};

//pull short list by short list filter query if exists
export const getShortListByFilterQuery = async (query: any) => {
    try {
        return await ShortList.find(query);
    } catch (err: any) {
        throw err;
    }
};

//Check if an short list already exist in Database
export const shortListAlreadyIsNotExists = async (employeeId: String, createdBy: ObjectId) => {

    const shortList: any = await getShortListInfoByFilterQuery({ employeeId, createdBy });

    if (shortList) {
        const customError: any = new Error("Already exists!. Please enter a new employee.");
        customError.statusCode = 400;
        throw customError;
    } else return true;
};

//Get All Reader API
export const getShortListInfo = async (req: Request) => {
    try {
        const pagination = await getPagination(req);

        const query: FilterQuery<ShortListDocument> = {};

        //@ts-ignore
        const loggedInUserInfo: any = req.user;

        if (loggedInUserInfo.client) query.createdBy = loggedInUserInfo._id;

        const shortList = await ShortList.find(query, {}, pagination);
        const totalShortList = await ShortList.find(query).count();

        return {
            total: totalShortList,
            count: shortList.length,
            next: shortList.length === pagination.limit ? pagination.skip + pagination.limit : null,
            shortList
        };

    } catch (err: any) {
        throw err;
    }
};

//Add short list to Database
export const addShortListInfo = async (req: Request) => {
    try {
        let input: DocumentDefinition<ShortListDocument> = req.body;

        //@ts-ignore
        const loggedInUserInfo: any = req.user;

        const createdBy = loggedInUserInfo._id;

        input.createdBy = createdBy;

        const employeeId: any = input.employeeId;

        const employeeInfo: any = await getUserInfoById(employeeId);

        if (!employeeInfo) {
            const customError: any = new Error("Invalid employee info!");
            customError.statusCode = 400;
            throw customError;
        }

        const clientInfo: any = await getUserInfoById(createdBy);

        if (!clientInfo) {
            const customError: any = new Error("Invalid client info!");
            customError.statusCode = 400;
            throw customError;
        }

        const isEmployeeHiredPrevious: any = await getHiredHistoryInfoByFilterQuery({ employeeId: employeeId, hiredBy: createdBy });
        if (!isEmployeeHiredPrevious) input.feeAmount = 500;

        const getEmployeeInfo: any = _.pick(employeeInfo, ["name", "positionId", "presentAddress", "permanentAddress",
            "employeeExperience", "rating", "totalWorkingHour", "hourlyRate", "profilePicture"]);

        getEmployeeInfo.restaurantName = clientInfo.restaurantName;
        getEmployeeInfo.restaurantAddress = clientInfo.restaurantAddress;
        getEmployeeInfo.employeeId = employeeId;

        input.employeeDetails = getEmployeeInfo;

        return await ShortList.create(input);

    } catch (err: any) {
        throw err;
    }
};

//update short list info according to short list id.
export const updateShortListInfo = async (req: Request) => {
    try {
        const updateData: DocumentDefinition<ShortListDocument> = req.body;

        const shortListInfo: any = await getShortListInfoById(req.body.id);

        if (!shortListInfo) {
            const customError: any = new Error("Invalid short list info!");
            customError.statusCode = 400;
            throw customError;
        }

        const shortList: any = new ShortList(shortListInfo);
        let isChanged = false;

        if (updateData.fromDate && shortListInfo.fromDate !== updateData.fromDate) {
            isChanged = true;
            shortList.fromDate = updateData.fromDate;
        }

        if (updateData.toDate && shortListInfo.toDate !== updateData.toDate) {
            isChanged = true;
            shortList.toDate = updateData.toDate;
        }

        if (isChanged) {
            return await shortList.save();
        }

        return shortListInfo;

    } catch (err: any) {
        throw err;
    }
};

//delete short list info according to short list id.
export const deleteShortListInfo = async (req: Request) => {
    try {

        //@ts-ignore
        const loggedInUserInfo: any = req.user;

        const createdBy: any = loggedInUserInfo._id;

        const query: any = { _id: req.params.id, createdBy: createdBy };

        const shortListInfo: any = await getShortListInfoByFilterQuery(query);

        if (!shortListInfo) {
            const customError: any = new Error("Invalid short list info!");
            customError.statusCode = 400;
            throw customError;
        }

        return await ShortList.deleteOne(query);

    } catch (err: any) {
        throw err;
    }
};

//delete short list info according to hired history filter query.
export const removeShortListInfoBasedOnHiredHistory = async (query: any, opts?: any) => {
    try {
        return await ShortList.deleteMany(query);

    } catch (err: any) {
        throw err;
    }
};