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
exports.removeShortListInfoBasedOnHiredHistory = exports.deleteShortListInfo = exports.updateShortListInfo = exports.addShortListInfo = exports.getShortListInfo = exports.shortListAlreadyIsNotExists = exports.getShortListByFilterQuery = exports.getShortListInfoByFilterQuery = exports.getShortListInfoById = void 0;
const lodash_1 = __importDefault(require("lodash"));
const pagination_helper_1 = require("../helpers/pagination-helper");
const short_list_model_1 = __importDefault(require("../models/short-list-model"));
const user_service_1 = require("./user-service");
const hired_history_service_1 = require("./hired-history-service");
//pull short list info by short list id if exists
const getShortListInfoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield short_list_model_1.default.findById(id);
    }
    catch (err) {
        throw err;
    }
});
exports.getShortListInfoById = getShortListInfoById;
//pull short list by short list filter query if exists
const getShortListInfoByFilterQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield short_list_model_1.default.findOne(query);
    }
    catch (err) {
        throw err;
    }
});
exports.getShortListInfoByFilterQuery = getShortListInfoByFilterQuery;
//pull short list by short list filter query if exists
const getShortListByFilterQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield short_list_model_1.default.find(query);
    }
    catch (err) {
        throw err;
    }
});
exports.getShortListByFilterQuery = getShortListByFilterQuery;
//Check if an short list already exist in Database
const shortListAlreadyIsNotExists = (employeeId, createdBy) => __awaiter(void 0, void 0, void 0, function* () {
    const shortList = yield (0, exports.getShortListInfoByFilterQuery)({ employeeId, createdBy });
    if (shortList) {
        const customError = new Error("Already exists!. Please enter a new employee.");
        customError.statusCode = 400;
        throw customError;
    }
    else
        return true;
});
exports.shortListAlreadyIsNotExists = shortListAlreadyIsNotExists;
//Get All Reader API
const getShortListInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pagination = yield (0, pagination_helper_1.getPagination)(req);
        const query = {};
        //@ts-ignore
        const loggedInUserInfo = req.user;
        if (loggedInUserInfo.client)
            query.createdBy = loggedInUserInfo._id;
        const shortList = yield short_list_model_1.default.find(query, {}, pagination);
        const totalShortList = yield short_list_model_1.default.find(query).count();
        return {
            total: totalShortList,
            count: shortList.length,
            next: shortList.length === pagination.limit ? pagination.skip + pagination.limit : null,
            shortList
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getShortListInfo = getShortListInfo;
//Add short list to Database
const addShortListInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let input = req.body;
        //@ts-ignore
        const loggedInUserInfo = req.user;
        const createdBy = loggedInUserInfo._id;
        input.createdBy = createdBy;
        const employeeId = input.employeeId;
        const employeeInfo = yield (0, user_service_1.getUserInfoById)(employeeId);
        if (!employeeInfo) {
            const customError = new Error("Invalid employee info!");
            customError.statusCode = 400;
            throw customError;
        }
        const clientInfo = yield (0, user_service_1.getUserInfoById)(createdBy);
        if (!clientInfo) {
            const customError = new Error("Invalid client info!");
            customError.statusCode = 400;
            throw customError;
        }
        const isEmployeeHiredPrevious = yield (0, hired_history_service_1.getHiredHistoryInfoByFilterQuery)({ employeeId: employeeId, hiredBy: createdBy });
        if (!isEmployeeHiredPrevious)
            input.feeAmount = 500;
        const getEmployeeInfo = lodash_1.default.pick(employeeInfo, ["name", "positionId", "presentAddress", "permanentAddress",
            "employeeExperience", "rating", "totalWorkingHour", "hourlyRate", "profilePicture"]);
        getEmployeeInfo.restaurantName = clientInfo.restaurantName;
        getEmployeeInfo.restaurantAddress = clientInfo.restaurantAddress;
        getEmployeeInfo.employeeId = employeeId;
        input.employeeDetails = getEmployeeInfo;
        return yield short_list_model_1.default.create(input);
    }
    catch (err) {
        throw err;
    }
});
exports.addShortListInfo = addShortListInfo;
//update short list info according to short list id.
const updateShortListInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateData = req.body;
        const shortListInfo = yield (0, exports.getShortListInfoById)(req.body.id);
        if (!shortListInfo) {
            const customError = new Error("Invalid short list info!");
            customError.statusCode = 400;
            throw customError;
        }
        const shortList = new short_list_model_1.default(shortListInfo);
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
            return yield shortList.save();
        }
        return shortListInfo;
    }
    catch (err) {
        throw err;
    }
});
exports.updateShortListInfo = updateShortListInfo;
//delete short list info according to short list id.
const deleteShortListInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const loggedInUserInfo = req.user;
        const createdBy = loggedInUserInfo._id;
        const query = { _id: req.params.id, createdBy: createdBy };
        const shortListInfo = yield (0, exports.getShortListInfoByFilterQuery)(query);
        if (!shortListInfo) {
            const customError = new Error("Invalid short list info!");
            customError.statusCode = 400;
            throw customError;
        }
        return yield short_list_model_1.default.deleteOne(query);
    }
    catch (err) {
        throw err;
    }
});
exports.deleteShortListInfo = deleteShortListInfo;
//delete short list info according to hired history filter query.
const removeShortListInfoBasedOnHiredHistory = (query, opts) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield short_list_model_1.default.deleteMany(query);
    }
    catch (err) {
        throw err;
    }
});
exports.removeShortListInfoBasedOnHiredHistory = removeShortListInfoBasedOnHiredHistory;
