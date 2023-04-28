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
exports.getSourceListForDropDown = exports.getSourceList = exports.removeSourceInfoInfo = exports.updateSourceInfo = exports.addSourceInfo = exports.sourceAlreadyIsNotExists = exports.getSourcesByFilterQuery = exports.getSourceInfoByFilterQuery = exports.getSourceInfoById = void 0;
const pagination_helper_1 = require("../helpers/pagination-helper");
const source_model_1 = __importDefault(require("../models/source-model"));
//pull source  info by source Id if exists
const getSourceInfoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield source_model_1.default.findById(id);
    }
    catch (err) {
        throw err;
    }
});
exports.getSourceInfoById = getSourceInfoById;
//getting source  info by filter query
const getSourceInfoByFilterQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield source_model_1.default.findOne(query);
    }
    catch (err) {
        throw err;
    }
});
exports.getSourceInfoByFilterQuery = getSourceInfoByFilterQuery;
//getting source  info by filter query
const getSourcesByFilterQuery = (query, fileds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedFileds = {};
        if (fileds)
            selectedFileds = fileds;
        return yield source_model_1.default.find(query, selectedFileds);
    }
    catch (err) {
        throw err;
    }
});
exports.getSourcesByFilterQuery = getSourcesByFilterQuery;
//Check if an source  already exist in Database
const sourceAlreadyIsNotExists = (name, id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = { name: name };
    if (id)
        query._id = { $ne: id };
    const source = yield (0, exports.getSourceInfoByFilterQuery)(query);
    if (source) {
        const customError = new Error("Source  already exists!. Please enter a new source .");
        customError.statusCode = 400;
        throw customError;
    }
    else
        return true;
});
exports.sourceAlreadyIsNotExists = sourceAlreadyIsNotExists;
//Add source  to Database
const addSourceInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        //@ts-ignore
        const loggedInUserInfo = req.user;
        input.createdBy = loggedInUserInfo._id;
        return yield source_model_1.default.create(input);
    }
    catch (err) {
        throw err;
    }
});
exports.addSourceInfo = addSourceInfo;
//update source  info according to source  id.
const updateSourceInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateData = req.body;
        const sourceInfo = yield (0, exports.getSourceInfoById)(req.body.id);
        if (!sourceInfo) {
            const customError = new Error("Invalid source  info!");
            customError.statusCode = 400;
            throw customError;
        }
        const source = new source_model_1.default(sourceInfo);
        let isChanged = false;
        if (updateData.name && sourceInfo.name !== updateData.name) {
            isChanged = true;
            source.name = updateData.name;
        }
        if (sourceInfo.active !== updateData.active) {
            isChanged = true;
            source.active = updateData.active;
        }
        if (isChanged) {
            return yield source.save();
        }
        return sourceInfo;
    }
    catch (err) {
        throw err;
    }
});
exports.updateSourceInfo = updateSourceInfo;
//remove source  info and related info
const removeSourceInfoInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = { _id: req.body.id };
        const sourceInfo = yield (0, exports.getSourceInfoByFilterQuery)(query);
        if (!sourceInfo) {
            const customError = new Error("Invalid source  info");
            customError.statusCode = 400;
            throw customError;
        }
        return yield source_model_1.default.updateOne(query, { $set: { deleted: true, active: false } });
    }
    catch (err) {
        throw err;
    }
});
exports.removeSourceInfoInfo = removeSourceInfoInfo;
//Get All Reader API
const getSourceList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pagination = yield (0, pagination_helper_1.getPagination)(req);
        const query = {};
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
        const sources = yield source_model_1.default.find(query, {}, pagination);
        const totalSources = yield source_model_1.default.find(query).count();
        return {
            total: totalSources,
            count: sources.length,
            next: sources.length === pagination.limit ? pagination.skip + pagination.limit : null,
            sources
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getSourceList = getSourceList;
//get list for dropdown 
const getSourceListForDropDown = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pagination = yield (0, pagination_helper_1.getPagination)(req);
        pagination.sort = { name: 1 };
        const query = { active: true };
        const searchKeyword = req.query.searchKeyword;
        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }
        const sources = yield source_model_1.default.find(query, { name: 1 }, pagination);
        return {
            count: sources.length,
            next: sources.length === pagination.limit ? pagination.skip + pagination.limit : null,
            sources
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getSourceListForDropDown = getSourceListForDropDown;
