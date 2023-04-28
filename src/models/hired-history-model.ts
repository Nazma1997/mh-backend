import mongoose from "mongoose";

export interface HiredHistoryDocument {
    name: String;
    active: Boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: mongoose.Types.ObjectId;
};

export interface HiredHistoryStatusDocument {
    id: mongoose.Types.ObjectId;
    active: Boolean;
    createdBy: mongoose.Types.ObjectId;
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
    profilePicture: String,
});

export const HiredHistorySchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Types.ObjectId,
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
        hiredBy: { // this id is client id
            type: mongoose.Types.ObjectId,
            required: true,
        },
        hiredDate: {
            type: Date,
            required: true,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            required: true,
        }
    },
    { timestamps: true }
);

const HiredHistory = mongoose.model<HiredHistoryDocument>("hired-histories", HiredHistorySchema);

export default HiredHistory;