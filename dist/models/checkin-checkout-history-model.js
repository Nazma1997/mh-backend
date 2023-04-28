"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInCheckOutHistorySchema = void 0;
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
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    profilePicture: String,
});
const RestaurantSchema = new mongoose_1.default.Schema({
    hiredBy: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    restaurantName: {
        type: String,
    },
    restaurantAddress: {
        type: String,
    },
    lat: {
        type: String,
    },
    long: {
        type: String,
    },
});
const CheckInCheckOutSchema = new mongoose_1.default.Schema({
    hiredBy: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    checkInDistance: {
        type: Number,
        default: 0
    },
    checkOutDistance: {
        type: Number,
        default: 0
    },
    checkIn: {
        type: Boolean,
        default: false
    },
    checkOut: {
        type: Boolean,
        default: false
    },
    checkInTime: {
        type: String,
    },
    checkOutTime: {
        type: String,
    },
    breakTime: {
        type: Number,
        default: 0
    },
    emmergencyCheckIn: {
        type: Boolean,
        default: false
    },
    emmergencyCheckOut: {
        type: Boolean,
        default: false
    },
    emmergencyCheckInComment: {
        type: String,
    },
    emmergencyCheckOutComment: {
        type: String,
    },
    clientCheckInTime: {
        type: String,
    },
    clientCheckOutTime: {
        type: String,
    },
    clientComment: {
        type: String,
    },
    clientBreakTime: {
        type: Number,
        default: 0
    },
    serverAutoCheckOut: {
        type: Boolean,
        default: false
    },
    checkInLat: {
        type: String,
    },
    checkInLong: {
        type: String,
    },
    checkOutLat: {
        type: String,
    },
    checkOutLong: {
        type: String,
    },
    emmergencyCheckInLat: {
        type: String,
    },
    emmergencyCheckInLong: {
        type: String,
    },
    emmergencyCheckOutLat: {
        type: String,
    },
    emmergencyCheckOutLong: {
        type: String,
    },
});
exports.CheckInCheckOutHistorySchema = new mongoose_1.default.Schema({
    employeeId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    currentHiredEmployeeId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    hiredBy: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    employeeDetails: EmployeeSchema,
    restaurantDetails: RestaurantSchema,
    checkInCheckOutDetails: CheckInCheckOutSchema,
    fromDate: {
        type: Date,
    },
    toDate: {
        type: Date,
    },
    hiredDate: {
        type: Date,
    },
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    }
}, { timestamps: true });
const CheckInCheckOutHistory = mongoose_1.default.model("checkin-checkout-histories", exports.CheckInCheckOutHistorySchema);
exports.default = CheckInCheckOutHistory;
