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
exports.addHiredHistoryInfo = exports.getEmployeeHiredHistoryListForClient = exports.getHiredHistoryList = exports.getHiredHistoryListByFilterQuery = exports.getHiredHistoryInfoByFilterQuery = exports.getHiredHistoryInfoById = void 0;
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const config_1 = __importDefault(require("config"));
const pagination_helper_1 = require("../helpers/pagination-helper");
const hired_history_model_1 = __importDefault(require("../models/hired-history-model"));
const user_model_1 = __importDefault(require("../models/user-model"));
const short_list_service_1 = require("./short-list-service");
const push_notification_service_1 = require("./push-notification-service");
//pull hired history info by hired history id if exists
const getHiredHistoryInfoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield hired_history_model_1.default.findById(id);
    }
    catch (err) {
        throw err;
    }
});
exports.getHiredHistoryInfoById = getHiredHistoryInfoById;
//getting hired history info by filter query
const getHiredHistoryInfoByFilterQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield hired_history_model_1.default.findOne(query);
    }
    catch (err) {
        throw err;
    }
});
exports.getHiredHistoryInfoByFilterQuery = getHiredHistoryInfoByFilterQuery;
//getting hired history info by filter query
const getHiredHistoryListByFilterQuery = (query, fileds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedFileds = {};
        if (fileds)
            selectedFileds = fileds;
        return yield hired_history_model_1.default.find(query, selectedFileds);
    }
    catch (err) {
        throw err;
    }
});
exports.getHiredHistoryListByFilterQuery = getHiredHistoryListByFilterQuery;
//Get All Reader API
const getHiredHistoryList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pagination = yield (0, pagination_helper_1.getPagination)(req);
        const query = {};
        //@ts-ignore
        const loggedInUserInfo = req.user;
        if (!loggedInUserInfo) {
            const customError = new Error("You are not authorized");
            customError.statusCode = 401;
            throw customError;
        }
        const createdBy = loggedInUserInfo.id;
        const { active } = req.query;
        const searchKeyword = req.query.searchKeyword;
        if (active === "YES")
            query.active = true;
        else if (active === "NO")
            query.active = false;
        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }
        query.createdBy = createdBy;
        const hiredHistories = yield hired_history_model_1.default.find(query, {}, pagination);
        const totalHiredHistories = yield hired_history_model_1.default.find(query).count();
        return {
            total: totalHiredHistories,
            count: hiredHistories.length,
            next: hiredHistories.length === pagination.limit ? pagination.skip + pagination.limit : null,
            hiredHistories
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getHiredHistoryList = getHiredHistoryList;
//Get All Employee List For Client Reader API
const getEmployeeHiredHistoryListForClient = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pagination = yield (0, pagination_helper_1.getPagination)(req);
        let query = {};
        //@ts-ignore
        const loggedInUserInfo = req.user;
        if (!loggedInUserInfo) {
            const customError = new Error("You are not authorized");
            customError.statusCode = 401;
            throw customError;
        }
        const createdBy = loggedInUserInfo.id;
        let { active, filterDate } = req.query;
        const searchKeyword = req.query.searchKeyword;
        if (filterDate) {
            const formateDate = (0, moment_1.default)(filterDate).format('YYYY-MM-DD');
            query = {
                $and: [
                    { fromDate: { $lte: formateDate } },
                    { toDate: { $gte: formateDate } }
                ]
            };
        }
        if (active === "YES")
            query.active = true;
        else if (active === "NO")
            query.active = false;
        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }
        query.hiredBy = createdBy;
        const hiredHistories = yield hired_history_model_1.default.find(query, {}, pagination);
        const totalHiredHistories = yield hired_history_model_1.default.find(query).count();
        return {
            total: totalHiredHistories,
            count: hiredHistories.length,
            next: hiredHistories.length === pagination.limit ? pagination.skip + pagination.limit : null,
            hiredHistories
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getEmployeeHiredHistoryListForClient = getEmployeeHiredHistoryListForClient;
//Add  hired history info to database
const addHiredHistoryInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield hired_history_model_1.default.startSession();
    session.startTransaction();
    const opts = { session: session };
    try {
        //@ts-ignore
        const loggedInUserInfo = req.user;
        if (!loggedInUserInfo) {
            const customError = new Error("You are not authorized");
            customError.statusCode = 401;
            throw customError;
        }
        const createdBy = loggedInUserInfo._id;
        const hiredByLat = loggedInUserInfo.lat;
        const hiredByLong = loggedInUserInfo.long;
        const shortListedIds = lodash_1.default.compact(lodash_1.default.uniq(req.body.selectedShortlist));
        const shortListInfo = yield (0, short_list_service_1.getShortListByFilterQuery)({ _id: { $in: shortListedIds }, createdBy: createdBy });
        if (lodash_1.default.size(shortListedIds) !== lodash_1.default.size(shortListInfo)) {
            const customError = new Error("Invalid short list info");
            customError.statusCode = 400;
            throw customError;
        }
        const hiredData = [];
        yield Promise.all(lodash_1.default.map(shortListInfo, (itemInfo) => __awaiter(void 0, void 0, void 0, function* () {
            const hiredInfo = lodash_1.default.pick(itemInfo, ["employeeId", "employees", "feeAmount", "fromDate", "toDate", "employeeDetails"]);
            hiredInfo.createdBy = createdBy;
            hiredInfo.hiredBy = createdBy;
            hiredInfo.active = true;
            hiredInfo.hiredDate = (0, moment_1.default)().format('YYYY-MM-DD');
            hiredData.push(hiredInfo);
            const hiredBySetData = {
                isHired: true,
                hiredBy: createdBy,
                hiredFromDate: itemInfo.fromDate,
                hiredToDate: itemInfo.toDate,
                hiredByLat: hiredByLat,
                hiredByLong: hiredByLong,
                hiredByRestaurantName: itemInfo.employeeDetails.restaurantName,
                hiredByRestaurantAddress: itemInfo.employeeDetails.restaurantAddress
            };
            const updateEmployeeInfo = yield user_model_1.default.updateOne({ _id: itemInfo.employeeId }, { $set: hiredBySetData }, opts);
            if (itemInfo && itemInfo.employeeDetails && itemInfo.employeeDetails.restaurantName && itemInfo.fromDate && itemInfo.toDate) {
                const notificationData = {
                    title: `Congratulation`,
                    body: `${itemInfo.employeeDetails.restaurantName} restaurant hire you from ${itemInfo.fromDate} to ${itemInfo.toDate}`
                };
                yield (0, push_notification_service_1.getUserInfoBasedOnPushNotificationInfo)({ _id: hiredInfo.employeeId }, notificationData);
            }
        })));
        const hiredHistory = yield hired_history_model_1.default.create(hiredData, opts);
        const clearShortListInfo = yield (0, short_list_service_1.removeShortListInfoBasedOnHiredHistory)({ createdBy }, opts);
        //Start For Push Notification
        if (loggedInUserInfo && loggedInUserInfo.restaurantName && lodash_1.default.size(shortListInfo)) {
            const notificationData = { title: `Employee Hired`, body: `${loggedInUserInfo.restaurantName} restaurant hired ${lodash_1.default.size(shortListInfo)} employees` };
            yield (0, push_notification_service_1.getUserInfoBasedOnPushNotificationInfo)({ email: config_1.default.get("ADMIN_PUSH_NOTIFICATION_EMAIL") }, notificationData);
        }
        //End For Push Notification
        yield session.commitTransaction();
        session.endSession();
        return hiredHistory;
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
exports.addHiredHistoryInfo = addHiredHistoryInfo;
