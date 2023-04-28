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
exports.getConversationInfoBasedOnFirstAndSecondId = exports.getUserChatConversationInfo = exports.getConversationList = exports.removeConversationInfo = exports.addConversationInfo = exports.getConversationsByFilterQuery = exports.getConversationInfoByFilterQuery = exports.getConversationInfoById = void 0;
const pagination_helper_1 = require("../helpers/pagination-helper");
const conversation_model_1 = __importDefault(require("../models/conversation-model"));
//pull conversation info by conversationId if exists
const getConversationInfoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield conversation_model_1.default.findById(id);
    }
    catch (err) {
        throw err;
    }
});
exports.getConversationInfoById = getConversationInfoById;
//getting conversation info by filter query
const getConversationInfoByFilterQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield conversation_model_1.default.findOne(query);
    }
    catch (err) {
        throw err;
    }
});
exports.getConversationInfoByFilterQuery = getConversationInfoByFilterQuery;
//getting conversation info by filter query
const getConversationsByFilterQuery = (query, fileds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedFileds = {};
        if (fileds)
            selectedFileds = fileds;
        return yield conversation_model_1.default.find(query, selectedFileds);
    }
    catch (err) {
        throw err;
    }
});
exports.getConversationsByFilterQuery = getConversationsByFilterQuery;
//Add conversation info to Database
const addConversationInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        //@ts-ignore
        const loggedInUserInfo = req.user;
        input.members = [req.body.senderId, req.body.receiverId];
        input.createdBy = loggedInUserInfo._id;
        return yield conversation_model_1.default.create(input);
    }
    catch (err) {
        throw err;
    }
});
exports.addConversationInfo = addConversationInfo;
//remove conversation info and related info
const removeConversationInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = { _id: req.body.id };
        const conversationInfo = yield (0, exports.getConversationInfoByFilterQuery)(query);
        if (!conversationInfo) {
            const customError = new Error("Invalid conversation info");
            customError.statusCode = 400;
            throw customError;
        }
        return yield conversation_model_1.default.updateOne(query, { $set: { deleted: true, active: false } });
    }
    catch (err) {
        throw err;
    }
});
exports.removeConversationInfo = removeConversationInfo;
//Get All Reader API
const getConversationList = (req) => __awaiter(void 0, void 0, void 0, function* () {
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
        const conversations = yield conversation_model_1.default.find(query, {}, pagination);
        const totalConversations = yield conversation_model_1.default.find(query).count();
        return {
            total: totalConversations,
            count: conversations.length,
            next: conversations.length === pagination.limit ? pagination.skip + pagination.limit : null,
            conversations
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getConversationList = getConversationList;
//get list for dropdown 
const getUserChatConversationInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield (0, exports.getConversationInfoByFilterQuery)({ members: { $in: [req.params.userId] } });
    }
    catch (err) {
        throw err;
    }
});
exports.getUserChatConversationInfo = getUserChatConversationInfo;
//get list for dropdown 
const getConversationInfoBasedOnFirstAndSecondId = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield (0, exports.getConversationInfoByFilterQuery)({ members: { $all: [req.params.firstId, req.params.secondId] } });
    }
    catch (err) {
        throw err;
    }
});
exports.getConversationInfoBasedOnFirstAndSecondId = getConversationInfoBasedOnFirstAndSecondId;
