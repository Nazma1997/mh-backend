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
exports.getTermsConditionList = exports.removeTermsConditionInfo = exports.updateTermsConditionInfo = exports.addTermsConditionInfo = exports.getTermsConditionsByFilterQuery = exports.getTermsConditionInfoByFilterQuery = exports.getTermsConditionInfoById = void 0;
const pagination_helper_1 = require("../helpers/pagination-helper");
const terms_condition_model_1 = __importDefault(require("../models/terms-condition-model"));
//pull terms condition info by terms condition id if exists
const getTermsConditionInfoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield terms_condition_model_1.default.findById(id);
    }
    catch (err) {
        throw err;
    }
});
exports.getTermsConditionInfoById = getTermsConditionInfoById;
//getting terms condition info by filter query
const getTermsConditionInfoByFilterQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield terms_condition_model_1.default.findOne(query);
    }
    catch (err) {
        throw err;
    }
});
exports.getTermsConditionInfoByFilterQuery = getTermsConditionInfoByFilterQuery;
//getting terms condition info by filter query
const getTermsConditionsByFilterQuery = (query, fileds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedFileds = {};
        if (fileds)
            selectedFileds = fileds;
        return yield terms_condition_model_1.default.find(query, selectedFileds);
    }
    catch (err) {
        throw err;
    }
});
exports.getTermsConditionsByFilterQuery = getTermsConditionsByFilterQuery;
//Add terms condition info to Database
const addTermsConditionInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        //@ts-ignore
        const loggedInUserInfo = req.user;
        input.createdBy = loggedInUserInfo._id;
        return yield terms_condition_model_1.default.create(input);
    }
    catch (err) {
        throw err;
    }
});
exports.addTermsConditionInfo = addTermsConditionInfo;
//update terms condition info according to terms condition id.
const updateTermsConditionInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateData = req.body;
        const termsConditionInfo = yield (0, exports.getTermsConditionInfoById)(req.body.id);
        if (!termsConditionInfo) {
            const customError = new Error("Invalid terms and condition info!");
            customError.statusCode = 400;
            throw customError;
        }
        const termsCondition = new terms_condition_model_1.default(termsConditionInfo);
        let isChanged = false;
        if (updateData.description && termsConditionInfo.description !== updateData.description) {
            isChanged = true;
            termsCondition.description = updateData.description;
        }
        if (termsConditionInfo.active !== updateData.active) {
            isChanged = true;
            termsCondition.active = updateData.active;
        }
        if (isChanged) {
            return yield termsCondition.save();
        }
        return termsConditionInfo;
    }
    catch (err) {
        throw err;
    }
});
exports.updateTermsConditionInfo = updateTermsConditionInfo;
//remove terms conditions info and related info
const removeTermsConditionInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = { _id: req.body.id };
        const termsConditionInfo = yield (0, exports.getTermsConditionInfoByFilterQuery)(query);
        if (!termsConditionInfo) {
            const customError = new Error("Invalid terms and condition info");
            customError.statusCode = 400;
            throw customError;
        }
        return yield terms_condition_model_1.default.updateOne(query, { $set: { deleted: true, active: false } });
    }
    catch (err) {
        throw err;
    }
});
exports.removeTermsConditionInfo = removeTermsConditionInfo;
//Get All Reader API
const getTermsConditionList = (req) => __awaiter(void 0, void 0, void 0, function* () {
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
            query.description = regExSearch;
        }
        const termsConditions = yield terms_condition_model_1.default.find(query, {}, pagination);
        const totalTermsConditions = yield terms_condition_model_1.default.find(query).count();
        return {
            total: totalTermsConditions,
            count: termsConditions.length,
            next: termsConditions.length === pagination.limit ? pagination.skip + pagination.limit : null,
            termsConditions
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getTermsConditionList = getTermsConditionList;
