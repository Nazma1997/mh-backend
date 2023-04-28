"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortListSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
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
    restaurantName: {
        type: String,
    },
    restaurantAddress: {
        type: String,
    },
});
exports.ShortListSchema = new mongoose_1.default.Schema({
    employeeId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    employeeDetails: EmployeeSchema,
    feeAmount: {
        type: Number,
        default: 0
    },
    fromDate: {
        type: Date,
    },
    toDate: {
        type: Date,
    },
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    }
}, { timestamps: true });
const ShortList = mongoose_1.default.model("short-lists", exports.ShortListSchema);
exports.default = ShortList;
