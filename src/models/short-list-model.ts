import mongoose from "mongoose";

export interface ShortListDocument {
    id: mongoose.Types.ObjectId;
    employeeId: mongoose.Types.ObjectId;
    positionId: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    fromDate: Date;
    toDate: Date;
    feeAmount: Number;
    createdAt: Date;
    updatedAt: Date;
    employeeDetails: typeof EmployeeSchema;
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
    restaurantName: {
        type: String,
    },
    restaurantAddress: {
        type: String,
    },
});

export const ShortListSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        employeeDetails: EmployeeSchema,
        feeAmount: {// introduction fee
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
            type: mongoose.Types.ObjectId,
            required: true,
        }
    },
    { timestamps: true }
);

const ShortList = mongoose.model<ShortListDocument>("short-lists", ShortListSchema);

export default ShortList;