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
exports.getPositionListForDropDown = exports.getPositionList = exports.removePositionInfo = exports.updatePositionInfo = exports.addPositionInfo = exports.positionAlreadyIsNotExists = exports.getPositionsByFilterQuery = exports.getPositionInfoByFilterQuery = exports.getPositionInfoById = void 0;
const pagination_helper_1 = require("../helpers/pagination-helper");
const slug_helper_1 = __importDefault(require("../helpers/slug-helper"));
const position_model_1 = __importDefault(require("../models/position-model"));
//pull position info by positionId if exists
const getPositionInfoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield position_model_1.default.findById(id);
    }
    catch (err) {
        throw err;
    }
});
exports.getPositionInfoById = getPositionInfoById;
//getting position info by filter query
const getPositionInfoByFilterQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield position_model_1.default.findOne(query);
    }
    catch (err) {
        throw err;
    }
});
exports.getPositionInfoByFilterQuery = getPositionInfoByFilterQuery;
//getting position info by filter query
const getPositionsByFilterQuery = (query, fileds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedFileds = {};
        if (fileds)
            selectedFileds = fileds;
        return yield position_model_1.default.find(query, selectedFileds);
    }
    catch (err) {
        throw err;
    }
});
exports.getPositionsByFilterQuery = getPositionsByFilterQuery;
//Check if an position already exist in Database
const positionAlreadyIsNotExists = (name, id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = { name: name };
    if (id)
        query._id = { $ne: id };
    const position = yield (0, exports.getPositionInfoByFilterQuery)(query);
    if (position) {
        const customError = new Error("Position already exists!. Please enter a new position.");
        customError.statusCode = 400;
        throw customError;
    }
    else
        return true;
});
exports.positionAlreadyIsNotExists = positionAlreadyIsNotExists;
//Add position to Database
const addPositionInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        //@ts-ignore
        const loggedInUserInfo = req.user;
        input.createdBy = loggedInUserInfo._id;
        const positionName = input.name;
        input.slug = yield (0, slug_helper_1.default)(positionName);
        return yield position_model_1.default.create(input);
    }
    catch (err) {
        throw err;
    }
});
exports.addPositionInfo = addPositionInfo;
//update position info according to position id.
const updatePositionInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateData = req.body;
        const positionInfo = yield (0, exports.getPositionInfoById)(req.body.id);
        if (!positionInfo) {
            const customError = new Error("Invalid position info!");
            customError.statusCode = 400;
            throw customError;
        }
        const position = new position_model_1.default(positionInfo);
        let isChanged = false;
        if (updateData.name && positionInfo.name !== updateData.name) {
            isChanged = true;
            position.name = updateData.name;
            //Generate slug
            position.slug = yield (0, slug_helper_1.default)(position.name);
        }
        if (positionInfo.active !== updateData.active) {
            isChanged = true;
            position.active = updateData.active;
        }
        if (isChanged) {
            return yield position.save();
        }
        return positionInfo;
    }
    catch (err) {
        throw err;
    }
});
exports.updatePositionInfo = updatePositionInfo;
//remove position info and related info
const removePositionInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = { _id: req.body.id };
        const positionInfo = yield (0, exports.getPositionInfoByFilterQuery)(query);
        if (!positionInfo) {
            const customError = new Error("Invalid position info");
            customError.statusCode = 400;
            throw customError;
        }
        return yield position_model_1.default.updateOne(query, { $set: { deleted: true, active: false } });
    }
    catch (err) {
        throw err;
    }
});
exports.removePositionInfo = removePositionInfo;
//Get All Reader API
const getPositionList = (req) => __awaiter(void 0, void 0, void 0, function* () {
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
        const positions = yield position_model_1.default.find(query, {}, pagination);
        const totalPositions = yield position_model_1.default.find(query).count();
        return {
            total: totalPositions,
            count: positions.length,
            next: positions.length === pagination.limit ? pagination.skip + pagination.limit : null,
            positions
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getPositionList = getPositionList;
//get list for dropdown 
const getPositionListForDropDown = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pagination = yield (0, pagination_helper_1.getPagination)(req);
        pagination.sort = { name: 1 };
        const query = { active: true };
        const searchKeyword = req.query.searchKeyword;
        if (searchKeyword) {
            let regExSearch = new RegExp(searchKeyword, 'i');
            query.name = regExSearch;
        }
        const positions = yield position_model_1.default.find(query, { name: 1 }, pagination);
        return {
            count: positions.length,
            next: positions.length === pagination.limit ? pagination.skip + pagination.limit : null,
            positions
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getPositionListForDropDown = getPositionListForDropDown;
