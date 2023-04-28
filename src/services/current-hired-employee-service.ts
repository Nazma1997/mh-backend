import { getUserInfoByFilterQuery } from './user-service';
import { Request } from "express";
import mongoose, { FilterQuery, DocumentDefinition, ObjectId } from "mongoose";

import _ from "lodash";
import moment from "moment";

import { getPagination } from "../helpers/pagination-helper";
import CurrentHiredEmployee, { CurrentHiredEmployeeDocument } from "../models/current-hired-employee-model";
import CheckInCheckOutHistory from '../models/checkin-checkout-history-model';
import User from '../models/user-model';


//pull current hired employee info by current hired employee id if exists
export const getCurrentHiredEmployeeInfoById = async (id: ObjectId) => {
    try {
        return await CurrentHiredEmployee.findById(id);
    } catch (err: any) {
        throw err;
    }
};

//getting current hired employee info by filter query
export const getCurrentHiredEmployeeInfoByFilterQuery = async (query: FilterQuery<CurrentHiredEmployeeDocument>) => {
    try {
        return await CurrentHiredEmployee.findOne(query);
    } catch (err: any) {
        throw err;
    }
};

//getting current hired employee info by filter query
export const getCurrentHiredEmployeeListByFilterQuery = async (query: FilterQuery<CurrentHiredEmployeeDocument>, fileds?: Object) => {
    try {
        let selectedFileds: Object = {};
        if (fileds) selectedFileds = fileds;

        return await CurrentHiredEmployee.find(query, selectedFileds);
    } catch (err: any) {
        throw err;
    }
};

//Add current hired employee to Database
export const addCurrentHiredEmployeeInfo = async (req: Request) => {

    const session = await CurrentHiredEmployee.startSession();
    session.startTransaction();

    const opts: any = { session: session };

    try {
        const input: DocumentDefinition<CurrentHiredEmployeeDocument> = req.body;

        //@ts-ignore
        const loggedInUserInfo: any = req.user;

        input.createdBy = loggedInUserInfo._id;

        const employeeInfo: any = await getUserInfoByFilterQuery({ _id: req.body.employeeId });

        if (!employeeInfo) {
            const customError: any = new Error("Invalid employee info");
            customError.statusCode = 400;
            throw customError;
        }

        input.fromDate = employeeInfo.hiredFromDate;
        input.toDate = employeeInfo.hiredToDate;

        const getEmployeeInfo: any = _.pick(employeeInfo, ["name", "positionId", "presentAddress", "permanentAddress", "employeeExperience", "rating",
            "totalWorkingHour", "hourlyRate", "profilePicture"]);

        getEmployeeInfo.employeeId = employeeInfo._id;
        getEmployeeInfo.fromDate = employeeInfo.hiredFromDate;
        getEmployeeInfo.toDate = employeeInfo.hiredToDate;

        input.employeeDetails = getEmployeeInfo;

        //Client or hired by or restuarent info
        const clientInfo: any = await getUserInfoByFilterQuery({ _id: employeeInfo.hiredBy });

        if (!clientInfo) {
            const customError: any = new Error("Client Not Found!");
            customError.statusCode = 400;
            throw customError;
        }

        const restaurantDetails: any = _.pick(clientInfo, ["restaurantName", "restaurantAddress", "lat", "long"]);

        restaurantDetails.hiredBy = clientInfo._id;
        input.restaurantDetails = restaurantDetails;

        const checkInCheckOutDetails: any = { hiredBy: clientInfo._id };

        if (input.checkIn) {
            checkInCheckOutDetails.checkIn = input.checkIn;
            checkInCheckOutDetails.checkInLat = input.lat;
            checkInCheckOutDetails.checkInLong = input.long;
        }

        if (input.emmergencyCheckIn) {
            checkInCheckOutDetails.emmergencyCheckIn = input.emmergencyCheckIn;
            checkInCheckOutDetails.emmergencyCheckInLat = input.lat;
            checkInCheckOutDetails.emmergencyCheckInLong = input.long;
        }

        if (input.emmergencyCheckInComment) checkInCheckOutDetails.emmergencyCheckInComment = input.emmergencyCheckInComment;
        if (input.checkInDistance) checkInCheckOutDetails.checkInDistance = input.checkInDistance;

        //generate time
        checkInCheckOutDetails.checkInTime = moment().format();

        input.checkInCheckOutDetails = checkInCheckOutDetails;
        input.hiredBy = clientInfo._id;

        const hiredDate: any = moment().format('YYYY-MM-DD')
        input.hiredDate = hiredDate;

        const checkInCheckOutHistoryData: any = _.clone(input);

        const addCurrentHiredEmployee = await CurrentHiredEmployee.create([input], opts);

        checkInCheckOutHistoryData.currentHiredEmployeeId = addCurrentHiredEmployee[0]._id;

        //For History
        const addCheckInCheckOutHistory: any = await CheckInCheckOutHistory.create([checkInCheckOutHistoryData], opts);

        await session.commitTransaction();
        session.endSession();

        return addCurrentHiredEmployee[0];

    } catch (err: any) {

        await session.abortTransaction();
        session.endSession();

        throw err;
    }
};

//update current hired employee info according to current hired employee id.
export const updateCurrentHiredEmployeeInfo = async (req: Request) => {
    try {
        //@ts-ignore
        const loggedInUserInfo: any = req.user;

        const createdBy = loggedInUserInfo._id;

        const updateData: DocumentDefinition<CurrentHiredEmployeeDocument> = req.body;

        const currentHiredEmployeeInfo: any = await getCurrentHiredEmployeeInfoById(req.body.id);

        if (!currentHiredEmployeeInfo) {
            const customError: any = new Error("Invalid current hired employee info!");
            customError.statusCode = 400;
            throw customError;
        }

        const checkInCheckOutDetails: any = {
            checkIn: currentHiredEmployeeInfo.checkInCheckOutDetails.checkIn,
            checkInLat: currentHiredEmployeeInfo.checkInCheckOutDetails.checkInLat,
            checkInLong: currentHiredEmployeeInfo.checkInCheckOutDetails.checkInLong,
            emmergencyCheckIn: currentHiredEmployeeInfo.checkInCheckOutDetails.emmergencyCheckIn,
            emmergencyCheckInLat: currentHiredEmployeeInfo.checkInCheckOutDetails.emmergencyCheckInLat,
            emmergencyCheckInLong: currentHiredEmployeeInfo.checkInCheckOutDetails.emmergencyCheckInLong,
            emmergencyCheckInComment: currentHiredEmployeeInfo.checkInCheckOutDetails.emmergencyCheckInComment,
            checkInTime: currentHiredEmployeeInfo.checkInCheckOutDetails.checkInTime,
            checkInDistance: currentHiredEmployeeInfo.checkInCheckOutDetails.checkInDistance,
        };

        if (updateData.checkOut) {
            checkInCheckOutDetails.checkOut = updateData.checkOut;
            checkInCheckOutDetails.checkOutLat = updateData.lat;
            checkInCheckOutDetails.checkOutLong = updateData.long;
        }

        if (updateData.emmergencyCheckOut) {
            checkInCheckOutDetails.emmergencyCheckOut = updateData.emmergencyCheckOut;
            checkInCheckOutDetails.emmergencyCheckInLat = updateData.lat;
            checkInCheckOutDetails.emmergencyCheckInLong = updateData.long;
        }

        if (updateData.emmergencyCheckOutComment) checkInCheckOutDetails.emmergencyCheckOutComment = updateData.emmergencyCheckOutComment;
        if (updateData.checkOutDistance) checkInCheckOutDetails.checkOutDistance = updateData.checkOutDistance;

        checkInCheckOutDetails.breakTime = updateData.breakTime;

        //generate time
        checkInCheckOutDetails.checkOutTime = moment().format();

        const addCheckInCheckOutHistory = await CheckInCheckOutHistory.updateOne({ currentHiredEmployeeId: req.body.id }, { $set: { checkInCheckOutDetails: checkInCheckOutDetails } });

        return await CurrentHiredEmployee.updateOne({ _id: req.body.id }, { $set: { checkInCheckOutDetails: checkInCheckOutDetails } });

    } catch (err: any) {
        throw err;
    }
};

//update client check in check out
export const updateCurrentHiredEmployeeStatusInfo = async (req: Request) => {
    try {
        const updateData: DocumentDefinition<CurrentHiredEmployeeDocument> = req.body;

        const currentHiredEmployeeInfo: any = await getCurrentHiredEmployeeInfoById(req.body.id);

        if (!currentHiredEmployeeInfo) {
            const customError: any = new Error("Invalid current hired employee info!");
            customError.statusCode = 400;
            throw customError;
        }

        let checkInCheckOutDetails: any = {
            checkIn: currentHiredEmployeeInfo.checkInCheckOutDetails.checkIn,
            checkInLat: currentHiredEmployeeInfo.checkInCheckOutDetails.checkInLat,
            checkInLong: currentHiredEmployeeInfo.checkInCheckOutDetails.checkInLong,
            emmergencyCheckIn: currentHiredEmployeeInfo.checkInCheckOutDetails.emmergencyCheckIn,
            emmergencyCheckInLat: currentHiredEmployeeInfo.checkInCheckOutDetails.emmergencyCheckInLat,
            emmergencyCheckInLong: currentHiredEmployeeInfo.checkInCheckOutDetails.emmergencyCheckInLong,
            emmergencyCheckInComment: currentHiredEmployeeInfo.checkInCheckOutDetails.emmergencyCheckInComment,
            checkInTime: currentHiredEmployeeInfo.checkInCheckOutDetails.checkInTime,
            checkInDistance: currentHiredEmployeeInfo.checkInCheckOutDetails.checkInDistance,
            checkOut: currentHiredEmployeeInfo.checkInCheckOutDetails.checkOut,
            checkOutLat: currentHiredEmployeeInfo.checkInCheckOutDetails.checkOutLat,
            checkOutLong: currentHiredEmployeeInfo.checkInCheckOutDetails.checkOutLong,
            emmergencyCheckOut: currentHiredEmployeeInfo.checkInCheckOutDetails.emmergencyCheckOut,
            emmergencyCheckOutComment: currentHiredEmployeeInfo.checkInCheckOutDetails.emmergencyCheckOutComment,
            checkOutDistance: currentHiredEmployeeInfo.checkInCheckOutDetails.checkOutDistance,
            breakTime: currentHiredEmployeeInfo.checkInCheckOutDetails.breakTime,
            checkOutTime: currentHiredEmployeeInfo.checkInCheckOutDetails.checkOutTime
        };

        if (updateData.checkIn) {
            checkInCheckOutDetails.checkIn = updateData.checkIn;

            const clientCheckInTime: any = updateData.clientCheckInTime;

            checkInCheckOutDetails.clientCheckInTime = moment(currentHiredEmployeeInfo.checkInCheckOutDetails.checkInTime).add(clientCheckInTime, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ');
        }

        if (updateData.checkOut) {
            checkInCheckOutDetails.checkOut = updateData.checkOut;

            const clientCheckOutTime: any = updateData.clientCheckOutTime;

            checkInCheckOutDetails.clientCheckOutTime = moment(currentHiredEmployeeInfo.checkInCheckOutDetails.checkOutTime).add(clientCheckOutTime, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ');
        }

        if (updateData.clientComment) checkInCheckOutDetails.clientComment = updateData.clientComment;

        checkInCheckOutDetails.clientBreakTime = updateData.clientBreakTime;

        const addCheckInCheckOutHistory = await CheckInCheckOutHistory.updateOne({ currentHiredEmployeeId: req.body.id }, { $set: { checkInCheckOutDetails: checkInCheckOutDetails } });

        return await CurrentHiredEmployee.updateOne({ _id: req.body.id }, { $set: { checkInCheckOutDetails: checkInCheckOutDetails } });

    } catch (err: any) {
        throw err;
    }
};

//Get All Reader API
export const getCurrentHiredEmployeeList = async (req: Request) => {
    try {

        //@ts-ignore
        const loggedInUserInfo: any = req.user;

        const pagination = await getPagination(req);

        const query: FilterQuery<CurrentHiredEmployeeDocument> = { hiredBy: new mongoose.Types.ObjectId(loggedInUserInfo._id) };

        let { active, filterDate }: any = req.query;
        const searchKeyword: any = req.query.searchKeyword;

        if (active === "YES") query.active = true;
        else if (active === "NO") query.active = false;

        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }

        if (filterDate) query.hiredDate = moment(filterDate).format('YYYY-MM-DD');

        const currentHiredEmployees = await CurrentHiredEmployee.find(query, {}, pagination);
        const totalCurrentHiredEmployees = await CurrentHiredEmployee.find(query).count();

        return {
            total: totalCurrentHiredEmployees,
            count: currentHiredEmployees.length,
            next: currentHiredEmployees.length === pagination.limit ? pagination.skip + pagination.limit : null,
            currentHiredEmployees
        };

    } catch (err: any) {
        throw err;
    }
};

//Get All Reader API
export const getCurrentHiredEmployeeCheckInCheckOutInfo = async (req: Request) => {

    const session = await CurrentHiredEmployee.startSession();
    session.startTransaction();

    const opts: any = { session: session };

    try {

        const query: any = { employeeId: new mongoose.Types.ObjectId(req.params.id) };

        let returnData = {};

        const currentHiredEmployee: any = await CurrentHiredEmployee.findOne(query).sort({ createdAt: -1 });

        let targetCheckInTime: any;
        let targetCheckOutTime: any;

        if (currentHiredEmployee && currentHiredEmployee.checkInCheckOutDetails) {

            //check in time
            if (currentHiredEmployee.checkInCheckOutDetails.clientCheckIn) targetCheckInTime = currentHiredEmployee.checkInCheckOutDetails.clientCheckInTime;
            else if (currentHiredEmployee.checkInCheckOutDetails.emmergencyCheckIn) targetCheckInTime = currentHiredEmployee.checkInCheckOutDetails.checkInTime;
            else if (currentHiredEmployee.checkInCheckOutDetails.checkIn) targetCheckInTime = currentHiredEmployee.checkInCheckOutDetails.checkInTime;

            //check out time 
            if (currentHiredEmployee.checkInCheckOutDetails.clientCheckOut) targetCheckOutTime = currentHiredEmployee.checkInCheckOutDetails.clientCheckOutTime;
            else if (currentHiredEmployee.checkInCheckOutDetails.emmergencyCheckOut) targetCheckOutTime = currentHiredEmployee.checkInCheckOutDetails.checkOutTime;
            else if (currentHiredEmployee.checkInCheckOutDetails.checkOut) targetCheckOutTime = currentHiredEmployee.checkInCheckOutDetails.checkOutTime;
        }

        //Now Date Time
        const nowDateTime: any = moment().format('YYYY-MM-DDTHH:mm:ssZ');

        if (targetCheckOutTime && (currentHiredEmployee.checkInCheckOutDetails.checkOut || currentHiredEmployee.checkInCheckOutDetails.emmergencyCheckOut || currentHiredEmployee.checkInCheckOutDetails.clientCheckOut)) {

            const formatedTargetCheckOutTime: any = moment(targetCheckOutTime).format('YYYY-MM-DDTHH:mm:ssZ');
            const formatedNowDateTime: any = moment(nowDateTime);

            const checkOutDiffHours: any = formatedNowDateTime.diff(formatedTargetCheckOutTime, 'hours');

            const currentDate = moment().format('YYYY-MM-DD');
            const currentHiredEmployeeToDate = moment(currentHiredEmployee.toDate).format('YYYY-MM-DD');

            if (currentHiredEmployeeToDate < currentDate) {

                //current hired info removed
                const updateCurrentHiredEmployee: any = await CurrentHiredEmployee.deleteMany({ employeeId: req.params.id }).session(opts.session);

                const userUnSetData: any = {
                    hiredFromDate: 1,
                    hiredToDate: 1,
                    hiredBy: 1,
                    hiredByLat: 1,
                    hiredByLong: 1,
                    hiredByRestaurantName: 1,
                    hiredByRestaurantAddress: 1
                };

                const updateUserInfo = await User.updateOne({ _id: req.params.id }, { $set: { isHired: false }, $unset: userUnSetData }, opts);

            } else if (checkOutDiffHours > 8) {

                const customError: any = new Error(`Next checkin ${checkOutDiffHours} hours later!`);
                customError.statusCode = 400;
                throw customError;

            } else {
                // details sent
                returnData = currentHiredEmployee;
            }

        } else if (targetCheckInTime && (currentHiredEmployee.checkInCheckOutDetails.checkIn || currentHiredEmployee.checkInCheckOutDetails.emmergencyCheckIn || currentHiredEmployee.checkInCheckOutDetails.clientCheckIn)) {

            const formatedTargetCheckInTime: any = moment(targetCheckInTime).format('YYYY-MM-DDTHH:mm:ssZ');
            const formatedNowDateTime: any = moment(nowDateTime);

            const checkIndiffHours: any = formatedNowDateTime.diff(formatedTargetCheckInTime, 'hours');

            if (checkIndiffHours > 16) {

                let setCurrentHiredCheckInCheckOutData: any = _.pick(currentHiredEmployee.checkInCheckOutDetails, ["checkIn", "checkInLat", "checkInLong",
                    "emmergencyCheckIn", "emmergencyCheckInLat", "emmergencyCheckInLong", "emmergencyCheckInComment", "checkInTime", "checkInDistance", "checkOut",
                    "checkOutLat", "checkOutLong", "emmergencyCheckOut", "emmergencyCheckOutComment", "checkOutDistance", "breakTime", "checkOutTime"]);

                setCurrentHiredCheckInCheckOutData.checkOut = true;
                setCurrentHiredCheckInCheckOutData.serverAutoCheckOut = true;
                setCurrentHiredCheckInCheckOutData.checkOutTime = moment(targetCheckInTime).add(16, 'hours').format('YYYY-MM-DDTHH:mm:ssZ');

                const updateCurrentHiredEmployee: any = await CurrentHiredEmployee.updateOne({ _id: currentHiredEmployee._id }, { $set: { checkInCheckOutDetails: setCurrentHiredCheckInCheckOutData } }, opts);
                const updateCheckInCheckOutHistory: any = await CheckInCheckOutHistory.updateOne({ currentHiredEmployeeId: currentHiredEmployee._id }, { $set: { checkInCheckOutDetails: setCurrentHiredCheckInCheckOutData } }, opts);
            } else {
                // details sent
                returnData = currentHiredEmployee;
            }
        }

        await session.commitTransaction();
        session.endSession();

        return returnData;

    } catch (err: any) {

        await session.abortTransaction();
        session.endSession();

        throw err;
    }
};