import mongoose from "mongoose";

export interface SourceDocument {
    name: String;
    active: Boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: mongoose.Types.ObjectId;
};

export interface SourceStatusDocument {
    id: mongoose.Types.ObjectId;
    active: Boolean;
    createdBy: mongoose.Types.ObjectId;
};

export const SourceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        active: {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            required: true,
        }
    },
    { timestamps: true }
);

const Source = mongoose.model<SourceDocument>("Source", SourceSchema);

export default Source;