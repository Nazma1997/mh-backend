import { Request } from "express";
import { FilterQuery, DocumentDefinition, ObjectId } from "mongoose";

import _ from "lodash";
import moment from "moment";
import config from "config";

import { getPagination } from "../helpers/pagination-helper";
import HiredHistory, { HiredHistoryDocument } from "../models/hired-history-model";
import User from "../models/user-model";
import { getShortListByFilterQuery, removeShortListInfoBasedOnHiredHistory } from "./short-list-service";
import { getUserInfoBasedOnPushNotificationInfo } from "./push-notification-service";


//pull hired history info by hired history id if exists
export const getHiredHistoryInfoById = async (id: ObjectId) => {
    try {
        return await HiredHistory.findById(id);
    } catch (err: any) {
        throw err;
    }
};

//getting hired history info by filter query
export const getHiredHistoryInfoByFilterQuery = async (query: FilterQuery<HiredHistoryDocument>) => {
    try {
        return await HiredHistory.findOne(query);
    } catch (err: any) {
        throw err;
    }
};

//getting hired history info by filter query
export const getHiredHistoryListByFilterQuery = async (query: FilterQuery<HiredHistoryDocument>, fileds?: Object) => {
    try {
        let selectedFileds: Object = {};
        if (fileds) selectedFileds = fileds;

        return await HiredHistory.find(query, selectedFileds);
    } catch (err: any) {
        throw err;
    }
};

//Get All Reader API
export const getHiredHistoryList = async (req: Request) => {
    try {
        const pagination = await getPagination(req);

        const query: FilterQuery<HiredHistoryDocument> = {};

        //@ts-ignore
        const loggedInUserInfo: any = req.user;

        if (!loggedInUserInfo) {
            const customError: any = new Error("You are not authorized");
            customError.statusCode = 401;
            throw customError;
        }

        const createdBy: any = loggedInUserInfo.id;

        const { active } = req.query;
        const searchKeyword: any = req.query.searchKeyword;

        if (active === "YES") query.active = true;
        else if (active === "NO") query.active = false;

        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }

        query.createdBy = createdBy;

        const hiredHistories = await HiredHistory.find(query, {}, pagination);
        const totalHiredHistories = await HiredHistory.find(query).count();

        return {
            total: totalHiredHistories,
            count: hiredHistories.length,
            next: hiredHistories.length === pagination.limit ? pagination.skip + pagination.limit : null,
            hiredHistories
        };

    } catch (err: any) {
        throw err;
    }
};

//Get All Employee List For Client Reader API
export const getEmployeeHiredHistoryListForClient = async (req: Request) => {
    try {
        const pagination = await getPagination(req);

        let query: FilterQuery<HiredHistoryDocument> = {};

        //@ts-ignore
        const loggedInUserInfo: any = req.user;

        if (!loggedInUserInfo) {
            const customError: any = new Error("You are not authorized");
            customError.statusCode = 401;
            throw customError;
        }

        const createdBy: any = loggedInUserInfo.id;

        let { active, filterDate }: any = req.query;
        const searchKeyword: any = req.query.searchKeyword;

        if (filterDate) {

            const formateDate = moment(filterDate).format('YYYY-MM-DD');

            query = {
                $and: [
                    { fromDate: { $lte: formateDate } },
                    { toDate: { $gte: formateDate } }
                ]
            };
        }

        if (active === "YES") query.active = true;
        else if (active === "NO") query.active = false;

        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }

        query.hiredBy = createdBy;

        const hiredHistories = await HiredHistory.find(query, {}, pagination);
        const totalHiredHistories = await HiredHistory.find(query).count();

        return {
            total: totalHiredHistories,
            count: hiredHistories.length,
            next: hiredHistories.length === pagination.limit ? pagination.skip + pagination.limit : null,
            hiredHistories
        };

    } catch (err: any) {
        throw err;
    }
};

//Add  hired history info to database
export const addHiredHistoryInfo = async (req: Request) => {

    const session = await HiredHistory.startSession();
    session.startTransaction();

    const opts: any = { session: session };

    try {

        //@ts-ignore
        const loggedInUserInfo: any = req.user;

        if (!loggedInUserInfo) {
            const customError: any = new Error("You are not authorized");
            customError.statusCode = 401;
            throw customError;
        }

        const createdBy: any = loggedInUserInfo._id;

        const hiredByLat: any = loggedInUserInfo.lat;
        const hiredByLong: any = loggedInUserInfo.long;

        const shortListedIds: any = _.compact(_.uniq(req.body.selectedShortlist));

        const shortListInfo: any = await getShortListByFilterQuery({ _id: { $in: shortListedIds }, createdBy: createdBy });

        if (_.size(shortListedIds) !== _.size(shortListInfo)) {
            const customError: any = new Error("Invalid short list info");
            customError.statusCode = 400;
            throw customError;
        }

        const hiredData: any = [];

        await Promise.all(_.map(shortListInfo, async (itemInfo: any) => {

            const hiredInfo: any = _.pick(itemInfo, ["employeeId", "employees", "feeAmount", "fromDate", "toDate", "employeeDetails"]);

            hiredInfo.createdBy = createdBy;
            hiredInfo.hiredBy = createdBy;
            hiredInfo.active = true;
            hiredInfo.hiredDate = moment().format('YYYY-MM-DD');

            hiredData.push(hiredInfo);

            const hiredBySetData: any = {
                isHired: true,
                hiredBy: createdBy,
                hiredFromDate: itemInfo.fromDate,
                hiredToDate: itemInfo.toDate,
                hiredByLat: hiredByLat,
                hiredByLong: hiredByLong,
                hiredByRestaurantName: itemInfo.employeeDetails.restaurantName,
                hiredByRestaurantAddress: itemInfo.employeeDetails.restaurantAddress
            };

            const updateEmployeeInfo: any = await User.updateOne({ _id: itemInfo.employeeId }, { $set: hiredBySetData }, opts);

            if (itemInfo && itemInfo.employeeDetails && itemInfo.employeeDetails.restaurantName && itemInfo.fromDate && itemInfo.toDate) {

                const notificationData: any = {
                    title: `Congratulation`,
                    body: `${itemInfo.employeeDetails.restaurantName} restaurant hire you from ${itemInfo.fromDate} to ${itemInfo.toDate}`
                };

                await getUserInfoBasedOnPushNotificationInfo({ _id: hiredInfo.employeeId }, notificationData);
            }

        }));

        const hiredHistory: any = await HiredHistory.create(hiredData, opts);

        const clearShortListInfo = await removeShortListInfoBasedOnHiredHistory({ createdBy }, opts);

        //Start For Push Notification
        if (loggedInUserInfo && loggedInUserInfo.restaurantName && _.size(shortListInfo)) {
            const notificationData: any = { title: `Employee Hired`, body: `${loggedInUserInfo.restaurantName} restaurant hired ${_.size(shortListInfo)} employees` };
            await getUserInfoBasedOnPushNotificationInfo({ email: config.get<string>("ADMIN_PUSH_NOTIFICATION_EMAIL") }, notificationData);
        }
        //End For Push Notification

        await session.commitTransaction();
        session.endSession();

        return hiredHistory;

    } catch (err: any) {

        await session.abortTransaction();
        session.endSession();

        throw err;
    }
};