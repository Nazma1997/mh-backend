import mongoose from "mongoose";

export interface CheckInCheckOutHistoryDocument {
    id: mongoose.Types.ObjectId;
    employeeId: mongoose.Types.ObjectId;
    currentHiredEmployeeId: mongoose.Types.ObjectId;
    hiredBy: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    active: Boolean;
    checkIn: Boolean;
    checkOut: Boolean;
    emmergencyCheckOut: Boolean;
    emmergencyCheckIn: Boolean;
    emmergencyCheckInComment: String;
    emmergencyCheckOutComment: String;
    clientCheckInTime: String;
    lat: String;
    long: String;
    clientComment: String;
    checkInDistance: Number;
    checkOutDistance: Number;
    clientBreakTime: Number;
    fromDate: Date;
    toDate: Date;
    createdAt: Date;
    updatedAt: Date;
    employeeDetails: typeof EmployeeSchema;
    restaurantDetails: typeof RestaurantSchema;
    checkInCheckOutDetails: typeof CheckInCheckOutSchema;
};

const EmployeeSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Types.ObjectId,
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

const RestaurantSchema = new mongoose.Schema({
    hiredBy: {
        type: mongoose.Types.ObjectId,
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

const CheckInCheckOutSchema = new mongoose.Schema({
    hiredBy: {
        type: mongoose.Types.ObjectId,
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
    breakTime: { //This field only minute thats why type is Number
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
    clientComment: { //when update to the employee check in or check out time then fillup to the coment or reason
        type: String,
    },
    clientBreakTime: { //This field only minute thats why type is Number
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

export const CheckInCheckOutHistorySchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        currentHiredEmployeeId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        hiredBy: {
            type: mongoose.Types.ObjectId,
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
        hiredDate: { //this is checkin checkout date
            type: Date,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            required: true,
        }
    },
    { timestamps: true }
);

const CheckInCheckOutHistory = mongoose.model<CheckInCheckOutHistoryDocument>("checkin-checkout-histories", CheckInCheckOutHistorySchema);

export default CheckInCheckOutHistory;