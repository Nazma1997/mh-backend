"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
;
//simillar to chat model
exports.ConversationSchema = new mongoose_1.default.Schema({
    members: [mongoose_1.default.Types.ObjectId],
    active: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    }
}, { timestamps: true });
const Conversation = mongoose_1.default.model("conversations", exports.ConversationSchema);
exports.default = Conversation;
