"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppErrorSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
;
exports.AppErrorSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    active: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose_1.default.Types.ObjectId,
    },
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
    }
}, { timestamps: true });
const AppError = mongoose_1.default.model("app-errors", exports.AppErrorSchema);
exports.default = AppError;
