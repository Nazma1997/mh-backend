"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsConditionSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
;
exports.TermsConditionSchema = new mongoose_1.default.Schema({
    description: {
        type: String,
        required: true
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
const TermsCondition = mongoose_1.default.model("terms-conditions", exports.TermsConditionSchema);
exports.default = TermsCondition;
