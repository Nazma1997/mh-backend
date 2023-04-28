import { Request } from "express";
import mongoose, { FilterQuery, DocumentDefinition, ObjectId } from "mongoose";

import config from "config";
import _ from "lodash";

import { getPagination } from "../helpers/pagination-helper";
import RequestEmployee, { RequestEmployeeDocument } from "../models/request-employee-model";
import { getUserInfoById, getUserListByFilterQuery } from "./user-service";
import { getPositionsByFilterQuery } from "./position-service";
import { getUserInfoBasedOnPushNotificationInfo } from "./push-notification-service";


//pull RequestEmployee info by RequestEmployeeId if exists
export const getRequestEmployeeInfoById = async (id: ObjectId) => {
    try {
        return await RequestEmployee.findById(id);
    } catch (err: any) {
        throw err;
    }
};

//getting RequestEmployee info by filter query
export const getRequestEmployeeInfoByFilterQuery = async (query: FilterQuery<RequestEmployeeDocument>) => {
    try {
        return await RequestEmployee.findOne(query);
    } catch (err: any) {
        throw err;
    }
};

//getting RequestEmployee info by filter query
export const getRequestEmployeesByFilterQuery = async (query: FilterQuery<RequestEmployeeDocument>, fileds?: Object) => {
    try {
        let selectedFileds: Object = {};
        if (fileds) selectedFileds = fileds;

        return await RequestEmployee.find(query, selectedFileds);
    } catch (err: any) {
        throw err;
    }
};

//Add RequestEmployee to Database
export const addRequestEmployeeInfo = async (req: Request) => {
    try {
        const input: DocumentDefinition<RequestEmployeeDocument> = req.body;

        //@ts-ignore
        const loggedInUserInfo: any = req.user;

        const clientInfo: any = await getUserInfoById(req.body.requestClientId);

        if (!clientInfo) {
            const customError: any = new Error("Invalid request client info!");
            customError.statusCode = 400;
            throw customError;
        }

        //Start client details
        const clientDetails: any = _.pick(clientInfo, ["restaurantName", "restaurantAddress", "email", "phoneNumber", "lat", "long"]);
        clientDetails.requestClientId = clientInfo._id;
        input.clientDetails = clientDetails;
        //End client details

        let positionIds: any = [];

        await Promise.all(_.map(input.employees, async (itemInfo: any) => {
            positionIds.push(itemInfo.positionId);
        }));

        const positionListInfo = await getPositionsByFilterQuery({ _id: { $in: positionIds }, active: true });

        if (_.size(positionListInfo) !== _.size(positionIds)) {
            const customError: any = new Error("Invalid position info!");
            customError.statusCode = 400;
            throw customError;
        }

        const clientRequestDetails: any = [];

        let totalNumberOfRequestEmployee: number = 0;

        await Promise.all(_.map(input.employees, async (itemInfo: any) => {

            const matchedPositionInfo = _.find(positionListInfo, (positionInfo) => {
                return positionInfo && positionInfo._id.toString() === itemInfo.positionId;
            });

            const clientRequestInfo: any = { numOfEmployee: itemInfo.numOfEmployee };

            totalNumberOfRequestEmployee += itemInfo.numOfEmployee;

            if (matchedPositionInfo) {
                clientRequestInfo.positionId = matchedPositionInfo._id;
                clientRequestInfo.positionName = matchedPositionInfo.name;
            }

            clientRequestDetails.push(clientRequestInfo);

        }));

        input.clientRequestDetails = clientRequestDetails;

        positionIds = _.compact(_.uniq(positionIds));

        input.createdBy = loggedInUserInfo._id;

        const addRequestEmployeeInfo: any = await RequestEmployee.create(input);

        if (loggedInUserInfo && loggedInUserInfo.restaurantName) {
            const notificationData: any = { title: 'Employee Request', body: `${loggedInUserInfo.restaurantName} request for ${totalNumberOfRequestEmployee} employees` };
            await getUserInfoBasedOnPushNotificationInfo({ email: config.get<string>("ADMIN_PUSH_NOTIFICATION_EMAIL") }, notificationData);
        }

        return addRequestEmployeeInfo;

    } catch (err: any) {
        throw err;
    }
};

//update RequestEmployee info according to RequestEmployee id.
export const updateRequestEmployeeInfo = async (req: Request) => {
    try {
        const updateData: DocumentDefinition<RequestEmployeeDocument> = req.body;

        const requestEmployeeInfo: any = await getRequestEmployeeInfoById(req.body.id);

        if (!requestEmployeeInfo) {
            const customError: any = new Error("Invalid request employee info!");
            customError.statusCode = 400;
            throw customError;
        }

        let employeeIds: any = _.compact(_.uniq(updateData.employeeIds));

        const employeeListInfo = await getUserListByFilterQuery({ _id: { $in: employeeIds }, active: true });

        if (_.size(employeeListInfo) !== _.size(employeeIds)) {
            const customError: any = new Error("Invalid employee info!");
            customError.statusCode = 400;
            throw customError;
        }

        const setData: any = {};
        let suggestedEmployeeDetails: any = [];

        //For Push Notification
        let employeeName: any;
        let positionName: any;
        let employeeExperience: any;

        await Promise.all(_.map(employeeListInfo, async (itemInfo: any) => {

            const employeeInfo: any = _.pick(itemInfo, ["name", "presentAddress", "permanentAddress", "employeeExperience", "rating", "totalWorkingHour", "hourlyRate", "fromDate", "toDate", "profilePicture", "cv", "positionId", "positionName"]);
            employeeInfo.employeeId = itemInfo._id;

            //For Push Notification
            employeeName = employeeInfo.name;
            positionName = employeeInfo.positionName;
            employeeExperience = employeeInfo.employeeExperience;

            suggestedEmployeeDetails.push(employeeInfo);
        }));

        setData.suggestedEmployeeDetails = [...requestEmployeeInfo.suggestedEmployeeDetails, ...suggestedEmployeeDetails];

        const updateRequestEmployeeInfo: any = await RequestEmployee.updateOne({ _id: req.body.id }, { $set: setData });

        //Start For Push Notification
        if (requestEmployeeInfo && requestEmployeeInfo.restaurantName && requestEmployeeInfo.email && positionName && employeeExperience && employeeName) {
            const notificationData: any = { title: `MH suggest a ${positionName} for you`, body: `${employeeName} with ${employeeExperience} years experience` };
            await getUserInfoBasedOnPushNotificationInfo({ email: requestEmployeeInfo.email }, notificationData);
        }
        //End For Push Notification

        return updateRequestEmployeeInfo;

    } catch (err: any) {
        throw err;
    }
};

//remove RequestEmployee info and related info
export const removeRequestEmployeeInfo = async (req: Request) => {
    try {

        const query = { _id: req.params.id };

        const requestEmployeeInfo: any = await getRequestEmployeeInfoByFilterQuery(query);

        if (!requestEmployeeInfo) {
            const customError: any = new Error("Invalid request employee info");
            customError.statusCode = 400;
            throw customError;
        }

        return await RequestEmployee.deleteOne(query);

    } catch (err: any) {
        throw err;
    }
};

//Get All Reader API
export const getRequestEmployeeList = async (req: Request) => {
    try {
        let pagination: any = await getPagination(req);

        //@ts-ignore
        const loggedInUserInfo: any = req.user;

        const query: FilterQuery<RequestEmployeeDocument> = {};

        const { active, requestType } = req.query;
        const searchKeyword: any = req.query.searchKeyword;

        if (active === "YES") query.active = true;
        else if (active === "NO") query.active = false;

        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }

        if (req.query && req.query.clientId) {
            const clientId: any = req.query.clientId;
            query.requestClientId = new mongoose.Types.ObjectId(clientId);
        }

        if (requestType === "CLIENT" && loggedInUserInfo && loggedInUserInfo._id) query.createdBy = new mongoose.Types.ObjectId(loggedInUserInfo._id);

        if (req.query.skipLimit === "YES") pagination = { sort: pagination.sort };

        const requestEmployees = await RequestEmployee.find(query, {}, pagination);
        const totalRequestEmployees = await RequestEmployee.find(query).count();

        return {
            total: totalRequestEmployees,
            count: requestEmployees.length,
            next: requestEmployees.length === pagination.limit ? pagination.skip + pagination.limit : null,
            requestEmployees
        };

    } catch (err: any) {
        throw err;
    }
};