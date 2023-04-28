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
exports.addInfo = exports.getInfo = exports.getAll = void 0;
const lodash_1 = __importDefault(require("lodash"));
const success_response_handler_1 = require("../middleware/success-response-handler");
const message_service_1 = require("../services/message-service");
//pass the client valid inputs to service
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield (0, message_service_1.getMessageList)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Message list fetch successfully!", null, message);
    }
    catch (err) {
        return next(err);
    }
});
exports.getAll = getAll;
//pass the client valid inputs to service
const getInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversationId = req.params.conversationId;
        const message = yield (0, message_service_1.getMessageInfoByFilterQuery)({ conversationId: conversationId });
        return yield (0, success_response_handler_1.successResponseHandler)(res, 200, "Message info fetch successfully!", "details", message);
    }
    catch (err) {
        return next(err);
    }
});
exports.getInfo = getInfo;
//pass the client valid inputs to service
const addInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = lodash_1.default.pick(req.body, ["senderId", "receiverId", "text"]);
        const conversation = yield (0, message_service_1.addMessageInfo)(req);
        return yield (0, success_response_handler_1.successResponseHandler)(res, 201, "Message created successfully!", "details", conversation);
    }
    catch (err) {
        return next(err);
    }
});
exports.addInfo = addInfo;
