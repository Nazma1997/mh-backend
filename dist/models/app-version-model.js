"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppVersionDocumentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
exports.AppVersionDocumentSchema = new mongoose_1.default.Schema({
    appVersion: {
        type: String,
        required: true,
    },
    updateRequired: {
        type: Boolean,
        default: true
    },
    appStoreLink: {
        type: String,
        required: true,
    },
    playStoreLink: {
        type: String,
        required: true,
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
const AppVersionDocument = mongoose_1.default.model("app-versions", exports.AppVersionDocumentSchema);
exports.default = AppVersionDocument;
