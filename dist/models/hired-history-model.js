"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HiredHistorySchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
;
const EmployeeSchema = new mongoose_1.default.Schema({
    employeeId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    positionId: {
        type: String,
    },
    presentAddress: String,
    permanentAddress: String,
    employeeExperience: {
        type: String
    },
    rating: {
        type: Number,
        default: 0
    },
    totalWorkingHour: {
        type: Number,
        default: 0
    },
    hourlyRate: {
        type: Number,
        default: 0
    },
    profilePicture: String,
});
exports.HiredHistorySchema = new mongoose_1.default.Schema({
    employeeId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    employeeDetails: EmployeeSchema,
    feeAmount: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: false
    },
    hiredBy: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    hiredDate: {
        type: Date,
        required: true,
    },
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    }
}, { timestamps: true });
const HiredHistory = mongoose_1.default.model("hired-histories", exports.HiredHistorySchema);
exports.default = HiredHistory;
