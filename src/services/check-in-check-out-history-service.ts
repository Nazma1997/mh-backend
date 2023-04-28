import { Request } from "express";
import mongoose, { FilterQuery, ObjectId } from "mongoose";

import _ from "lodash";
import moment from "moment";

import { getPagination } from "../helpers/pagination-helper";
import CheckInCheckOutHistory, { CheckInCheckOutHistoryDocument } from '../models/checkin-checkout-history-model';


//pull check in check out info by check in check out id if exists
export const getCheckInCheckOutHistoryInfoById = async (id: ObjectId) => {
    try {
        return await CheckInCheckOutHistory.findById(id);
    } catch (err: any) {
        throw err;
    }
};

//getting check in check out info by filter query
export const getCheckInCheckOutHistoryInfoByFilterQuery = async (query: FilterQuery<CheckInCheckOutHistoryDocument>) => {
    try {
        return await CheckInCheckOutHistory.findOne(query);
    } catch (err: any) {
        throw err;
    }
};

//getting check in check out info by filter query
export const getCheckInCheckOutHistoryListByFilterQuery = async (query: FilterQuery<CheckInCheckOutHistoryDocument>, fileds?: Object) => {
    try {
        let selectedFileds: Object = {};
        if (fileds) selectedFileds = fileds;

        return await CheckInCheckOutHistory.find(query, selectedFileds);
    } catch (err: any) {
        throw err;
    }
};

//Get All Reader API
export const getCheckInCheckOutHistoryList = async (req: Request) => {
    try {

        //@ts-ignore
        const loggedInUserInfo: any = req.user;

        const pagination = await getPagination(req);

        const query: FilterQuery<CheckInCheckOutHistoryDocument> = {};

        let { active, filterDate, clientId, employeeId, requestType }: any = req.query;
        const searchKeyword: any = req.query.searchKeyword;

        if (active === "YES") query.active = true;
        else if (active === "NO") query.active = false;

        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }

        if (filterDate) query.hiredDate = moment(filterDate).format('YYYY-MM-DD');
        if (clientId) query.hiredBy = new mongoose.Types.ObjectId(clientId);
        if (employeeId) query.employeeId = new mongoose.Types.ObjectId(employeeId);
        if (requestType === "CLIENT") query.hiredBy = new mongoose.Types.ObjectId(loggedInUserInfo._id); // tar nijer all employee jodi dekhte chai

        const checkInCheckOutHistory = await CheckInCheckOutHistory.find(query, {}, pagination);
        const totalCheckInCheckOutHistory = await CheckInCheckOutHistory.find(query).count();

        return {
            total: totalCheckInCheckOutHistory,
            count: checkInCheckOutHistory.length,
            next: checkInCheckOutHistory.length === pagination.limit ? pagination.skip + pagination.limit : null,
            checkInCheckOutHistory
        };

    } catch (err: any) {
        throw err;
    }
};

//Get All Reader API
export const getCheckInCheckOutHistoryListForEmployee = async (req: Request) => {
    try {

        //@ts-ignore
        const loggedInUserInfo: any = req.user;

        const pagination = await getPagination(req);

        const query: FilterQuery<CheckInCheckOutHistoryDocument> = { createdBy: new mongoose.Types.ObjectId(loggedInUserInfo._id) };

        let { active, filterDate }: any = req.query;
        const searchKeyword: any = req.query.searchKeyword;

        if (active === "YES") query.active = true;
        else if (active === "NO") query.active = false;

        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }

        if (filterDate) query.hiredDate = moment(filterDate).format('YYYY-MM-DD');

        const checkInCheckOutHistory = await CheckInCheckOutHistory.find(query, {}, pagination);
        const totalCheckInCheckOutHistory = await CheckInCheckOutHistory.find(query).count();

        return {
            total: totalCheckInCheckOutHistory,
            count: checkInCheckOutHistory.length,
            next: checkInCheckOutHistory.length === pagination.limit ? pagination.skip + pagination.limit : null,
            checkInCheckOutHistory
        };

    } catch (err: any) {
        throw err;
    }
};