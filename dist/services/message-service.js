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
exports.getMessageList = exports.addMessageInfo = exports.getMessagesByFilterQuery = exports.getMessageInfoByFilterQuery = exports.getMessageInfoById = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const pagination_helper_1 = require("../helpers/pagination-helper");
const message_model_1 = __importDefault(require("../models/message-model"));
const user_service_1 = require("./user-service");
//pull message info by messageId if exists
const getMessageInfoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield message_model_1.default.findById(id);
    }
    catch (err) {
        throw err;
    }
});
exports.getMessageInfoById = getMessageInfoById;
//getting message info by filter query
const getMessageInfoByFilterQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield message_model_1.default.findOne(query);
    }
    catch (err) {
        throw err;
    }
});
exports.getMessageInfoByFilterQuery = getMessageInfoByFilterQuery;
//getting message info by filter query
const getMessagesByFilterQuery = (query, fileds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let selectedFileds = {};
        if (fileds)
            selectedFileds = fileds;
        return yield message_model_1.default.find(query, selectedFileds);
    }
    catch (err) {
        throw err;
    }
});
exports.getMessagesByFilterQuery = getMessagesByFilterQuery;
//Add conversation info to Database
const addMessageInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.body;
        //@ts-ignore
        const loggedInUserInfo = req.user;
        input.createdBy = loggedInUserInfo._id;
        //Start sender details
        if (input.senderId) {
            const senderInfo = yield (0, user_service_1.getUserInfoById)(req.body.senderId);
            const senderDetails = {
                senderId: senderInfo._id,
                name: senderInfo.name,
                profilePicture: senderInfo.profilePicture,
            };
            input.senderDetails = senderDetails;
        }
        //End sender details
        //Start receiver details
        if (input.receiverId) {
            const receiverInfo = yield (0, user_service_1.getUserInfoById)(req.body.receiverId);
            const receiverDetails = {
                receiverId: receiverInfo._id,
                name: receiverInfo.name,
                profilePicture: receiverInfo.profilePicture,
            };
            input.receiverDetails = receiverDetails;
        }
        //End receiver details
        const addMessageInfo = yield message_model_1.default.create(input);
        // emit socket event
        //@ts-ignore
        global.io.emit("new_message", {
            message: {
                senderDetails: input.senderDetails,
                receiverDetails: input.receiverDetails,
                text: input.text,
                dateTime: addMessageInfo.dateTime,
            },
        });
        return addMessageInfo;
    }
    catch (err) {
        throw err;
    }
});
exports.addMessageInfo = addMessageInfo;
//Get All Reader API
const getMessageList = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pagination = yield (0, pagination_helper_1.getPagination)(req);
        let query = {};
        const { receiverId, senderId } = req.query;
        if (!receiverId || !senderId) {
            const customError = new Error("Sender or receiver must be given!");
            customError.statusCode = 400;
            throw customError;
        }
        else {
            query = {
                $or: [
                    { receiverId: new mongoose_1.default.Types.ObjectId(receiverId) },
                    { senderId: new mongoose_1.default.Types.ObjectId(receiverId) },
                    { receiverId: new mongoose_1.default.Types.ObjectId(senderId) },
                    { senderId: new mongoose_1.default.Types.ObjectId(senderId) },
                ],
            };
        }
        const messages = yield message_model_1.default.find(query, {}, pagination);
        return {
            count: messages.length,
            next: messages.length === pagination.limit ? pagination.skip + pagination.limit : null,
            messages
        };
    }
    catch (err) {
        throw err;
    }
});
exports.getMessageList = getMessageList;
