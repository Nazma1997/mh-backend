import mongoose from "mongoose";

export interface AppErrorDocument {
    name: String;
    description: String;
    active: Boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
};

export interface AppErrorStatusDocument {
    id: mongoose.Types.ObjectId;
    active: Boolean;
    createdBy: mongoose.Types.ObjectId;
};

export const AppErrorSchema = new mongoose.Schema(
    {
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
            type: mongoose.Types.ObjectId,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
        }
    },
    { timestamps: true }
);

const AppError = mongoose.model<AppErrorDocument>("app-errors", AppErrorSchema);

export default AppError;