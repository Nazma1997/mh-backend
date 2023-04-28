"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
;
const senderItemSchema = new mongoose_1.default.Schema({
    senderId: mongoose_1.default.Types.ObjectId,
    name: String,
    profilePicture: String,
});
const receiverItemSchema = new mongoose_1.default.Schema({
    receiverId: mongoose_1.default.Types.ObjectId,
    name: String,
    profilePicture: String,
});
exports.MessageSchema = new mongoose_1.default.Schema({
    receiverId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    senderId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    senderDetails: senderItemSchema,
    receiverDetails: receiverItemSchema,
    text: {
        type: String,
        required: true,
    },
    dateTime: {
        type: Date,
        default: Date.now,
    },
    active: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    }
}, { timestamps: true });
const Message = mongoose_1.default.model("messages", exports.MessageSchema);
exports.default = Message;
