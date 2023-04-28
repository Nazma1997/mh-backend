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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInfo = exports.getUserChatInfo = exports.getUserChatBasedOnFirstAndSecondIdInfo = exports.getInfo = exports.getAll = void 0;
const success_response_handler_1 = require("../middleware/success-response-handler");
const conversation_service_1 = require("../services/conversation-service");
//pass the client valid inputs to service
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversation = yield (0, conversation_service_1.getConversationList)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Conversation list fetch successfully!", null, conversation);
    }
    catch (err) {
        return next(err);
    }
});
exports.getAll = getAll;
//pass the client valid inputs to service
const getInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const conversation = yield (0, conversation_service_1.getConversationInfoById)(id);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Conversation info fetch successfully!", "details", conversation);
    }
    catch (err) {
        return next(err);
    }
});
exports.getInfo = getInfo;
//pass the client valid inputs to service
const getUserChatBasedOnFirstAndSecondIdInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const conversation = yield (0, conversation_service_1.getConversationInfoBasedOnFirstAndSecondId)(id);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Conversation info fetch successfully!", "details", conversation);
    }
    catch (err) {
        return next(err);
    }
});
exports.getUserChatBasedOnFirstAndSecondIdInfo = getUserChatBasedOnFirstAndSecondIdInfo;
//pass the client valid inputs to service
const getUserChatInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversation = yield (0, conversation_service_1.getUserChatConversationInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "User conversation info fetch successfully!", "details", conversation);
    }
    catch (err) {
        return next(err);
    }
});
exports.getUserChatInfo = getUserChatInfo;
//pass the client valid inputs to service
const addInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = { senderId: req.body.senderId, receiverId: req.body.receiverId };
        const conversation = yield (0, conversation_service_1.addConversationInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 201, "Conversation created successfully!", "details", conversation);
    }
    catch (err) {
        return next(err);
    }
});
exports.addInfo = addInfo;
