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
exports.getRequestEmployeeList = exports.removeRequestEmployeeInfo = exports.updateRequestEmployeeInfo = exports.addRequestEmployeeInfo = exports.getRequestEmployeesByFilterQuery = exports.getRequestEmployeeInfoByFilterQuery = exports.getRequestEmployeeInfoById = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const lodash_1 = __importDefault(require("lodash"));
const pagination_helper_1 = require("../helpers/pagination-helper");
const request_employee_model_1 = __importDefault(require("../models/request-employee-model"));
const user_service_1 = require("./user-service");
const position_service_1 = require("./position-service");
const push_notification_service_1 = require("./push-notification-service");
//pull RequestEmployee info by RequestEmployeeId if exists
const getRequestEmployeeInfoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield request_employee_model_1.default.findById(id);
    }
    catch (err) {
        throw err;
    }
});
exports.getRequestEmployeeInfoById = getRequestEmployeeInfoById;
//getting RequestEmployee info by filter query
const getRequestEmployeeInfoByFilterQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield request_employee_model_1.default.findOne(query);
    }
    catch (err) {
        throw err;
    }
});
exports.getRequestEmployeeInfoByFilterQuery = getRequestEmployeeInfoByFilterQuery;
//getting RequestEmployee info by filter query
const getRequestEmployeesByFilterQuery = (query, fileds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedFileds = {};
        if (fileds)
            selectedFileds = fileds;
        return yield request_employee_model_1.default.find(query, selectedFileds);
    }
    catch (err) {
        throw err;
    }
});
exports.getRequestEmployeesByFilterQuery = getRequestEmployeesByFilterQuery;
//Add RequestEmployee to Database
const addRequestEmployeeInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        //@ts-ignore
        const loggedInUserInfo = req.user;
        const clientInfo = yield (0, user_service_1.getUserInfoById)(req.body.requestClientId);
        if (!clientInfo) {
            const customError = new Error("Invalid request client info!");
            customError.statusCode = 400;
            throw customError;
        }
        //Start client details
        const clientDetails = lodash_1.default.pick(clientInfo, ["restaurantName", "restaurantAddress", "email", "phoneNumber", "lat", "long"]);
        clientDetails.requestClientId = clientInfo._id;
        input.clientDetails = clientDetails;
        //End client details
        let positionIds = [];
        yield Promise.all(lodash_1.default.map(input.employees, (itemInfo) => __awaiter(void 0, void 0, void 0, function* () {
            positionIds.push(itemInfo.positionId);
        })));
        const positionListInfo = yield (0, position_service_1.getPositionsByFilterQuery)({ _id: { $in: positionIds }, active: true });
        if (lodash_1.default.size(positionListInfo) !== lodash_1.default.size(positionIds)) {
            const customError = new Error("Invalid position info!");
            customError.statusCode = 400;
            throw customError;
        }
        const clientRequestDetails = [];
        let totalNumberOfRequestEmployee = 0;
        yield Promise.all(lodash_1.default.map(input.employees, (itemInfo) => __awaiter(void 0, void 0, void 0, function* () {
            const matchedPositionInfo = lodash_1.default.find(positionListInfo, (positionInfo) => {
                return positionInfo && positionInfo._id.toString() === itemInfo.positionId;
            });
            const clientRequestInfo = { numOfEmployee: itemInfo.numOfEmployee };
            totalNumberOfRequestEmployee += itemInfo.numOfEmployee;
            if (matchedPositionInfo) {
                clientRequestInfo.positionId = matchedPositionInfo._id;
                clientRequestInfo.positionName = matchedPositionInfo.name;
            }
            clientRequestDetails.push(clientRequestInfo);
        })));
        input.clientRequestDetails = clientRequestDetails;
        positionIds = lodash_1.default.compact(lodash_1.default.uniq(positionIds));
        input.createdBy = loggedInUserInfo._id;
        const addRequestEmployeeInfo = yield request_employee_model_1.default.create(input);
        if (loggedInUserInfo && loggedInUserInfo.restaurantName) {
            const notificationData = { title: 'Employee Request', body: `${loggedInUserInfo.restaurantName} request for ${totalNumberOfRequestEmployee} employees` };
            yield (0, push_notification_service_1.getUserInfoBasedOnPushNotificationInfo)({ email: config_1.default.get("ADMIN_PUSH_NOTIFICATION_EMAIL") }, notificationData);
        }
        return addRequestEmployeeInfo;
    }
    catch (err) {
        throw err;
    }
});
exports.addRequestEmployeeInfo = addRequestEmployeeInfo;
//update RequestEmployee info according to RequestEmployee id.
const updateRequestEmployeeInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateData = req.body;
        const requestEmployeeInfo = yield (0, exports.getRequestEmployeeInfoById)(req.body.id);
        if (!requestEmployeeInfo) {
            const customError = new Error("Invalid request employee info!");
            customError.statusCode = 400;
            throw customError;
        }
        let employeeIds = lodash_1.default.compact(lodash_1.default.uniq(updateData.employeeIds));
        const employeeListInfo = yield (0, user_service_1.getUserListByFilterQuery)({ _id: { $in: employeeIds }, active: true });
        if (lodash_1.default.size(employeeListInfo) !== lodash_1.default.size(employeeIds)) {
            const customError = new Error("Invalid employee info!");
            customError.statusCode = 400;
            throw customError;
        }
        const setData = {};
        let suggestedEmployeeDetails = [];
        //For Push Notification
        let employeeName;
        let positionName;
        let employeeExperience;
        yield Promise.all(lodash_1.default.map(employeeListInfo, (itemInfo) => __awaiter(void 0, void 0, void 0, function* () {
            const employeeInfo = lodash_1.default.pick(itemInfo, ["name", "presentAddress", "permanentAddress", "employeeExperience", "rating", "totalWorkingHour", "hourlyRate", "fromDate", "toDate", "profilePicture", "cv", "positionId", "positionName"]);
            employeeInfo.employeeId = itemInfo._id;
            //For Push Notification
            employeeName = employeeInfo.name;
            positionName = employeeInfo.positionName;
            employeeExperience = employeeInfo.employeeExperience;
            suggestedEmployeeDetails.push(employeeInfo);
        })));
        setData.suggestedEmployeeDetails = [...requestEmployeeInfo.suggestedEmployeeDetails, ...suggestedEmployeeDetails];
        const updateRequestEmployeeInfo = yield request_employee_model_1.default.updateOne({ _id: req.body.id }, { $set: setData });
        //Start For Push Notification
        if (requestEmployeeInfo && requestEmployeeInfo.restaurantName && requestEmployeeInfo.email && positionName && employeeExperience && employeeName) {
            const notificationData = { title: `MH suggest a ${positionName} for you`, body: `${employeeName} with ${employeeExperience} years experience` };
            yield (0, push_notification_service_1.getUserInfoBasedOnPushNotificationInfo)({ email: requestEmployeeInfo.email }, notificationData);
        }
        //End For Push Notification
        return updateRequestEmployeeInfo;
    }
    catch (err) {
        throw err;
    }
});
exports.updateRequestEmployeeInfo = updateRequestEmployeeInfo;
//remove RequestEmployee info and related info
const removeRequestEmployeeInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = { _id: req.params.id };
        const requestEmployeeInfo = yield (0, exports.getRequestEmployeeInfoByFilterQuery)(query);
        if (!requestEmployeeInfo) {
            const customError = new Error("Invalid request employee info");
            customError.statusCode = 400;
            throw customError;
        }
        return yield request_employee_model_1.default.deleteOne(query);
    }
    catch (err) {
        throw err;
    }
});
exports.removeRequestEmployeeInfo = removeRequestEmployeeInfo;
//Get All Reader API
const getRequestEmployeeList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pagination = yield (0, pagination_helper_1.getPagination)(req);
        //@ts-ignore
        const loggedInUserInfo = req.user;
        const query = {};
        const { active, requestType } = req.query;
        const searchKeyword = req.query.searchKeyword;
        if (active === "YES")
            query.active = true;
        else if (active === "NO")
            query.active = false;
        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }
        if (req.query && req.query.clientId) {
            const clientId = req.query.clientId;
            query.requestClientId = new mongoose_1.default.Types.ObjectId(clientId);
        }
        if (requestType === "CLIENT" && loggedInUserInfo && loggedInUserInfo._id)
            query.createdBy = new mongoose_1.default.Types.ObjectId(loggedInUserInfo._id);
        if (req.query.skipLimit === "YES")
            pagination = { sort: pagination.sort };
        const requestEmployees = yield request_employee_model_1.default.find(query, {}, pagination);
        const totalRequestEmployees = yield request_employee_model_1.default.find(query).count();
        return {
            total: totalRequestEmployees,
            count: requestEmployees.length,
            next: requestEmployees.length === pagination.limit ? pagination.skip + pagination.limit : null,
            requestEmployees
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getRequestEmployeeList = getRequestEmployeeList;
