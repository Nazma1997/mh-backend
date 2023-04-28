import mongoose from "mongoose";

export interface TermsConditionDocument {
    description: String;
    active: Boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: mongoose.Types.ObjectId;
};

export interface TermsConditionStatusDocument {
    id: mongoose.Types.ObjectId;
    active: Boolean;
    createdBy: mongoose.Types.ObjectId;
};

export const TermsConditionSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true
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

const TermsCondition = mongoose.model<TermsConditionDocument>("terms-conditions", TermsConditionSchema);

export default TermsCondition;