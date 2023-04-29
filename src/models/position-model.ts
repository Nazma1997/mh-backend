import mongoose from "mongoose";

export interface PositionDocument {
    name: String;
    slug: String;
    active: Boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: mongoose.Types.ObjectId;
};

export interface PositionStatusDocument {
    id: mongoose.Types.ObjectId;
    active: Boolean;
    createdBy: mongoose.Types.ObjectId;
};

export const PositionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        slug: {
            type: String,
            // required: true
        },
        active: {
            type: Boolean,
            default: false
        },
        // createdBy: {
        //     type: mongoose.Types.ObjectId,
        //     required: true,
        // }
    },
    { timestamps: true }
);

const Position = mongoose.model<PositionDocument>("Position", PositionSchema);

export default Position;