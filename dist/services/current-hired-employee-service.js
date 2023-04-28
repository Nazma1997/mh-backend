"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentHiredEmployeeCheckInCheckOutInfo = exports.getCurrentHiredEmployeeList = exports.updateCurrentHiredEmployeeStatusInfo = exports.updateCurrentHiredEmployeeInfo = exports.addCurrentHiredEmployeeInfo = exports.getCurrentHiredEmployeeListByFilterQuery = exports.getCurrentHiredEmployeeInfoByFilterQuery = exports.getCurrentHiredEmployeeInfoById = void 0;
const user_service_1 = require("./user-service");
const mongoose_1 = __importDefault(require("mongoose"));
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const pagination_helper_1 = require("../helpers/pagination-helper");
const current_hired_employee_model_1 = __importDefault(require("../models/current-hired-employee-model"));
const checkin_checkout_history_model_1 = __importDefault(require("../models/checkin-checkout-history-model"));
const user_model_1 = __importDefault(require("../models/user-model"));
//pull current hired employee info by current hired employee id if exists
const getCurrentHiredEmployeeInfoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield current_hired_employee_model_1.default.findById(id);
    }
    catch (err) {
        throw err;
    }
});
exports.getCurrentHiredEmployeeInfoById = getCurrentHiredEmployeeInfoById;
//getting current hired employee info by filter query
const getCurrentHiredEmployeeInfoByFilterQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield current_hired_employee_model_1.default.findOne(query);
    }
    catch (err) {
        throw err;
    }
});
exports.getCurrentHiredEmployeeInfoByFilterQuery = getCurrentHiredEmployeeInfoByFilterQuery;
//getting current hired employee info by filter query
const getCurrentHiredEmployeeListByFilterQuery = (query, fileds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedFileds = {};
        if (fileds)
            selectedFileds = fileds;
        return yield current_hired_employee_model_1.default.find(query, selectedFileds);
    }
    catch (err) {
        throw err;
    }
});
exports.getCurrentHiredEmployeeListByFilterQuery = getCurrentHiredEmployeeListByFilterQuery;
//Add current hired employee to Database
const addCurrentHiredEmployeeInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield current_hired_employee_model_1.default.startSession();
    session.startTransaction();
    const opts = { session: session };
    try {
        const input = req.body;
        //@ts-ignore
        const loggedInUserInfo = req.user;
        input.createdBy = loggedInUserInfo._id;
        const employeeInfo = yield (0, user_service_1.getUserInfoByFilterQuery)({ _id: req.body.employeeId });
        if (!employeeInfo) {
            const customError = new Error("Invalid employee info");
            customError.statusCode = 400;
            throw customError;
        }
        input.fromDate = employeeInfo.hiredFromDate;
        input.toDate = employeeInfo.hiredToDate;
        const getEmployeeInfo = lodash_1.default.pick(employeeInfo, ["name", "positionId", "presentAddress", "permanentAddress", "employeeExperience", "rating",
            "totalWorkingHour", "hourlyRate", "profilePicture"]);
        getEmployeeInfo.employeeId = employeeInfo._id;
        getEmployeeInfo.fromDate = employeeInfo.hiredFromDate;
        getEmployeeInfo.toDate = employeeInfo.hiredToDate;
        input.employeeDetails = getEmployeeInfo;
        //Client or hired by or restuarent info
        const clientInfo = yield (0, user_service_1.getUserInfoByFilterQuery)({ _id: employeeInfo.hiredBy });
        if (!clientInfo) {
            const customError = new Error("Client Not Found!");
            customError.statusCode = 400;
            throw customError;
        }
        const restaurantDetails = lodash_1.default.pick(clientInfo, ["restaurantName", "restaurantAddress", "lat", "long"]);
        restaurantDetails.hiredBy = clientInfo._id;
        input.restaurantDetails = restaurantDetails;
        const checkInCheckOutDetails = { hiredBy: clientInfo._id };
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
        if (input.emmergencyCheckInComment)
            checkInCheckOutDetails.emmergencyCheckInComment = input.emmergencyCheckInComment;
        if (input.checkInDistance)
            checkInCheckOutDetails.checkInDistance = input.checkInDistance;
        //generate time
        checkInCheckOutDetails.checkInTime = (0, moment_1.default)().format();
        input.checkInCheckOutDetails = checkInCheckOutDetails;
        input.hiredBy = clientInfo._id;
        const hiredDate = (0, moment_1.default)().format('YYYY-MM-DD');
        input.hiredDate = hiredDate;
        const checkInCheckOutHistoryData = lodash_1.default.clone(input);
        const addCurrentHiredEmployee = yield current_hired_employee_model_1.default.create([input], opts);
        checkInCheckOutHistoryData.currentHiredEmployeeId = addCurrentHiredEmployee[0]._id;
        //For History
        const addCheckInCheckOutHistory = yield checkin_checkout_history_model_1.default.create([checkInCheckOutHistoryData], opts);
        yield session.commitTransaction();
        session.endSession();
        return addCurrentHiredEmployee[0];
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
exports.addCurrentHiredEmployeeInfo = addCurrentHiredEmployeeInfo;
//update current hired employee info according to current hired employee id.
const updateCurrentHiredEmployeeInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const loggedInUserInfo = req.user;
        const createdBy = loggedInUserInfo._id;
        const updateData = req.body;
        const currentHiredEmployeeInfo = yield (0, exports.getCurrentHiredEmployeeInfoById)(req.body.id);
        if (!currentHiredEmployeeInfo) {
            const customError = new Error("Invalid current hired employee info!");
            customError.statusCode = 400;
            throw customError;
        }
        const checkInCheckOutDetails = {
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
        if (updateData.emmergencyCheckOutComment)
            checkInCheckOutDetails.emmergencyCheckOutComment = updateData.emmergencyCheckOutComment;
        if (updateData.checkOutDistance)
            checkInCheckOutDetails.checkOutDistance = updateData.checkOutDistance;
        checkInCheckOutDetails.breakTime = updateData.breakTime;
        //generate time
        checkInCheckOutDetails.checkOutTime = (0, moment_1.default)().format();
        const addCheckInCheckOutHistory = yield checkin_checkout_history_model_1.default.updateOne({ currentHiredEmployeeId: req.body.id }, { $set: { checkInCheckOutDetails: checkInCheckOutDetails } });
        return yield current_hired_employee_model_1.default.updateOne({ _id: req.body.id }, { $set: { checkInCheckOutDetails: checkInCheckOutDetails } });
    }
    catch (err) {
        throw err;
    }
});
exports.updateCurrentHiredEmployeeInfo = updateCurrentHiredEmployeeInfo;
//update client check in check out
const updateCurrentHiredEmployeeStatusInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateData = req.body;
        const currentHiredEmployeeInfo = yield (0, exports.getCurrentHiredEmployeeInfoById)(req.body.id);
        if (!currentHiredEmployeeInfo) {
            const customError = new Error("Invalid current hired employee info!");
            customError.statusCode = 400;
            throw customError;
        }
        let checkInCheckOutDetails = {
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
            const clientCheckInTime = updateData.clientCheckInTime;
            checkInCheckOutDetails.clientCheckInTime = (0, moment_1.default)(currentHiredEmployeeInfo.checkInCheckOutDetails.checkInTime).add(clientCheckInTime, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ');
        }
        if (updateData.checkOut) {
            checkInCheckOutDetails.checkOut = updateData.checkOut;
            const clientCheckOutTime = updateData.clientCheckOutTime;
            checkInCheckOutDetails.clientCheckOutTime = (0, moment_1.default)(currentHiredEmployeeInfo.checkInCheckOutDetails.checkOutTime).add(clientCheckOutTime, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ');
        }
        if (updateData.clientComment)
            checkInCheckOutDetails.clientComment = updateData.clientComment;
        checkInCheckOutDetails.clientBreakTime = updateData.clientBreakTime;
        const addCheckInCheckOutHistory = yield checkin_checkout_history_model_1.default.updateOne({ currentHiredEmployeeId: req.body.id }, { $set: { checkInCheckOutDetails: checkInCheckOutDetails } });
        return yield current_hired_employee_model_1.default.updateOne({ _id: req.body.id }, { $set: { checkInCheckOutDetails: checkInCheckOutDetails } });
    }
    catch (err) {
        throw err;
    }
});
exports.updateCurrentHiredEmployeeStatusInfo = updateCurrentHiredEmployeeStatusInfo;
//Get All Reader API
const getCurrentHiredEmployeeList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const loggedInUserInfo = req.user;
        const pagination = yield (0, pagination_helper_1.getPagination)(req);
        const query = { hiredBy: new mongoose_1.default.Types.ObjectId(loggedInUserInfo._id) };
        let { active, filterDate } = req.query;
        const searchKeyword = req.query.searchKeyword;
        if (active === "YES")
            query.active = true;
        else if (active === "NO")
            query.active = false;
        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }
        if (filterDate)
            query.hiredDate = (0, moment_1.default)(filterDate).format('YYYY-MM-DD');
        const currentHiredEmployees = yield current_hired_employee_model_1.default.find(query, {}, pagination);
        const totalCurrentHiredEmployees = yield current_hired_employee_model_1.default.find(query).count();
        return {
            total: totalCurrentHiredEmployees,
            count: currentHiredEmployees.length,
            next: currentHiredEmployees.length === pagination.limit ? pagination.skip + pagination.limit : null,
            currentHiredEmployees
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getCurrentHiredEmployeeList = getCurrentHiredEmployeeList;
//Get All Reader API
const getCurrentHiredEmployeeCheckInCheckOutInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield current_hired_employee_model_1.default.startSession();
    session.startTransaction();
    const opts = { session: session };
    try {
        const query = { employeeId: new mongoose_1.default.Types.ObjectId(req.params.id) };
        let returnData = {};
        const currentHiredEmployee = yield current_hired_employee_model_1.default.findOne(query).sort({ createdAt: -1 });
        let targetCheckInTime;
        let targetCheckOutTime;
        if (currentHiredEmployee && currentHiredEmployee.checkInCheckOutDetails) {
            //check in time
            if (currentHiredEmployee.checkInCheckOutDetails.clientCheckIn)
                targetCheckInTime = currentHiredEmployee.checkInCheckOutDetails.clientCheckInTime;
            else if (currentHiredEmployee.checkInCheckOutDetails.emmergencyCheckIn)
                targetCheckInTime = currentHiredEmployee.checkInCheckOutDetails.checkInTime;
            else if (currentHiredEmployee.checkInCheckOutDetails.checkIn)
                targetCheckInTime = currentHiredEmployee.checkInCheckOutDetails.checkInTime;
            //check out time 
            if (currentHiredEmployee.checkInCheckOutDetails.clientCheckOut)
                targetCheckOutTime = currentHiredEmployee.checkInCheckOutDetails.clientCheckOutTime;
            else if (currentHiredEmployee.checkInCheckOutDetails.emmergencyCheckOut)
                targetCheckOutTime = currentHiredEmployee.checkInCheckOutDetails.checkOutTime;
            else if (currentHiredEmployee.checkInCheckOutDetails.checkOut)
                targetCheckOutTime = currentHiredEmployee.checkInCheckOutDetails.checkOutTime;
        }
        //Now Date Time
        const nowDateTime = (0, moment_1.default)().format('YYYY-MM-DDTHH:mm:ssZ');
        if (targetCheckOutTime && (currentHiredEmployee.checkInCheckOutDetails.checkOut || currentHiredEmployee.checkInCheckOutDetails.emmergencyCheckOut || currentHiredEmployee.checkInCheckOutDetails.clientCheckOut)) {
            const formatedTargetCheckOutTime = (0, moment_1.default)(targetCheckOutTime).format('YYYY-MM-DDTHH:mm:ssZ');
            const formatedNowDateTime = (0, moment_1.default)(nowDateTime);
            const checkOutDiffHours = formatedNowDateTime.diff(formatedTargetCheckOutTime, 'hours');
            const currentDate = (0, moment_1.default)().format('YYYY-MM-DD');
            const currentHiredEmployeeToDate = (0, moment_1.default)(currentHiredEmployee.toDate).format('YYYY-MM-DD');
            if (currentHiredEmployeeToDate < currentDate) {
                //current hired info removed
                const updateCurrentHiredEmployee = yield current_hired_employee_model_1.default.deleteMany({ employeeId: req.params.id }).session(opts.session);
                const userUnSetData = {
                    hiredFromDate: 1,
                    hiredToDate: 1,
                    hiredBy: 1,
                    hiredByLat: 1,
                    hiredByLong: 1,
                    hiredByRestaurantName: 1,
                    hiredByRestaurantAddress: 1
                };
                const updateUserInfo = yield user_model_1.default.updateOne({ _id: req.params.id }, { $set: { isHired: false }, $unset: userUnSetData }, opts);
            }
            else if (checkOutDiffHours > 8) {
                const customError = new Error(`Next checkin ${checkOutDiffHours} hours later!`);
                customError.statusCode = 400;
                throw customError;
            }
            else {
                // details sent
                returnData = currentHiredEmployee;
            }
        }
        else if (targetCheckInTime && (currentHiredEmployee.checkInCheckOutDetails.checkIn || currentHiredEmployee.checkInCheckOutDetails.emmergencyCheckIn || currentHiredEmployee.checkInCheckOutDetails.clientCheckIn)) {
            const formatedTargetCheckInTime = (0, moment_1.default)(targetCheckInTime).format('YYYY-MM-DDTHH:mm:ssZ');
            const formatedNowDateTime = (0, moment_1.default)(nowDateTime);
            const checkIndiffHours = formatedNowDateTime.diff(formatedTargetCheckInTime, 'hours');
            if (checkIndiffHours > 16) {
                let setCurrentHiredCheckInCheckOutData = lodash_1.default.pick(currentHiredEmployee.checkInCheckOutDetails, ["checkIn", "checkInLat", "checkInLong",
                    "emmergencyCheckIn", "emmergencyCheckInLat", "emmergencyCheckInLong", "emmergencyCheckInComment", "checkInTime", "checkInDistance", "checkOut",
                    "checkOutLat", "checkOutLong", "emmergencyCheckOut", "emmergencyCheckOutComment", "checkOutDistance", "breakTime", "checkOutTime"]);
                setCurrentHiredCheckInCheckOutData.checkOut = true;
                setCurrentHiredCheckInCheckOutData.serverAutoCheckOut = true;
                setCurrentHiredCheckInCheckOutData.checkOutTime = (0, moment_1.default)(targetCheckInTime).add(16, 'hours').format('YYYY-MM-DDTHH:mm:ssZ');
                const updateCurrentHiredEmployee = yield current_hired_employee_model_1.default.updateOne({ _id: currentHiredEmployee._id }, { $set: { checkInCheckOutDetails: setCurrentHiredCheckInCheckOutData } }, opts);
                const updateCheckInCheckOutHistory = yield checkin_checkout_history_model_1.default.updateOne({ currentHiredEmployeeId: currentHiredEmployee._id }, { $set: { checkInCheckOutDetails: setCurrentHiredCheckInCheckOutData } }, opts);
            }
            else {
                // details sent
                returnData = currentHiredEmployee;
            }
        }
        yield session.commitTransaction();
        session.endSession();
        return returnData;
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
exports.getCurrentHiredEmployeeCheckInCheckOutInfo = getCurrentHiredEmployeeCheckInCheckOutInfo;
