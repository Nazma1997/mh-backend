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
exports.getCheckInCheckOutHistoryListForEmployee = exports.getCheckInCheckOutHistoryList = exports.getCheckInCheckOutHistoryListByFilterQuery = exports.getCheckInCheckOutHistoryInfoByFilterQuery = exports.getCheckInCheckOutHistoryInfoById = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
const pagination_helper_1 = require("../helpers/pagination-helper");
const checkin_checkout_history_model_1 = __importDefault(require("../models/checkin-checkout-history-model"));
//pull check in check out info by check in check out id if exists
const getCheckInCheckOutHistoryInfoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield checkin_checkout_history_model_1.default.findById(id);
    }
    catch (err) {
        throw err;
    }
});
exports.getCheckInCheckOutHistoryInfoById = getCheckInCheckOutHistoryInfoById;
//getting check in check out info by filter query
const getCheckInCheckOutHistoryInfoByFilterQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield checkin_checkout_history_model_1.default.findOne(query);
    }
    catch (err) {
        throw err;
    }
});
exports.getCheckInCheckOutHistoryInfoByFilterQuery = getCheckInCheckOutHistoryInfoByFilterQuery;
//getting check in check out info by filter query
const getCheckInCheckOutHistoryListByFilterQuery = (query, fileds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedFileds = {};
        if (fileds)
            selectedFileds = fileds;
        return yield checkin_checkout_history_model_1.default.find(query, selectedFileds);
    }
    catch (err) {
        throw err;
    }
});
exports.getCheckInCheckOutHistoryListByFilterQuery = getCheckInCheckOutHistoryListByFilterQuery;
//Get All Reader API
const getCheckInCheckOutHistoryList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const loggedInUserInfo = req.user;
        const pagination = yield (0, pagination_helper_1.getPagination)(req);
        const query = {};
        let { active, filterDate, clientId, employeeId, requestType } = req.query;
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
        if (clientId)
            query.hiredBy = new mongoose_1.default.Types.ObjectId(clientId);
        if (employeeId)
            query.employeeId = new mongoose_1.default.Types.ObjectId(employeeId);
        if (requestType === "CLIENT")
            query.hiredBy = new mongoose_1.default.Types.ObjectId(loggedInUserInfo._id); // tar nijer all employee jodi dekhte chai
        const checkInCheckOutHistory = yield checkin_checkout_history_model_1.default.find(query, {}, pagination);
        const totalCheckInCheckOutHistory = yield checkin_checkout_history_model_1.default.find(query).count();
        return {
            total: totalCheckInCheckOutHistory,
            count: checkInCheckOutHistory.length,
            next: checkInCheckOutHistory.length === pagination.limit ? pagination.skip + pagination.limit : null,
            checkInCheckOutHistory
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getCheckInCheckOutHistoryList = getCheckInCheckOutHistoryList;
//Get All Reader API
const getCheckInCheckOutHistoryListForEmployee = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const loggedInUserInfo = req.user;
        const pagination = yield (0, pagination_helper_1.getPagination)(req);
        const query = { createdBy: new mongoose_1.default.Types.ObjectId(loggedInUserInfo._id) };
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
        const checkInCheckOutHistory = yield checkin_checkout_history_model_1.default.find(query, {}, pagination);
        const totalCheckInCheckOutHistory = yield checkin_checkout_history_model_1.default.find(query).count();
        return {
            total: totalCheckInCheckOutHistory,
            count: checkInCheckOutHistory.length,
            next: checkInCheckOutHistory.length === pagination.limit ? pagination.skip + pagination.limit : null,
            checkInCheckOutHistory
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getCheckInCheckOutHistoryListForEmployee = getCheckInCheckOutHistoryListForEmployee;
