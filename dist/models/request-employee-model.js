"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestEmployeeSchema = void 0;
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
        type: mongoose_1.default.Types.ObjectId,
    },
    positionName: {
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
    cv: String,
});
const RestaurantSchema = new mongoose_1.default.Schema({
    requestClientId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    restaurantName: {
        type: String,
    },
    restaurantAddress: {
        type: String,
    },
    email: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    lat: {
        type: String,
    },
    long: {
        type: String,
    }
});
const ClientRequestDetailsSchema = new mongoose_1.default.Schema({
    positionId: {
        type: mongoose_1.default.Types.ObjectId,
    },
    positionName: {
        type: String,
    },
    numOfEmployee: {
        type: Number,
    }
});
exports.RequestEmployeeSchema = new mongoose_1.default.Schema({
    requestClientId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    clientDetails: RestaurantSchema,
    suggestedEmployeeDetails: [EmployeeSchema],
    clientRequestDetails: [ClientRequestDetailsSchema],
    active: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    }
}, { timestamps: true });
const RequestEmployee = mongoose_1.default.model("request-employees", exports.RequestEmployeeSchema);
exports.default = RequestEmployee;
