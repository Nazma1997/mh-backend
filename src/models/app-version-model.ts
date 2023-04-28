import mongoose from "mongoose";

export interface AppVersionDocument {
    appVersion: String;
    updateRequired: Boolean;
    active: Boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: mongoose.Types.ObjectId;
};

export const AppVersionDocumentSchema = new mongoose.Schema(
    {
        appVersion: {
            type: String,
            required: true,
        },
        updateRequired: {
            type: Boolean,
            default: true
        },
        appStoreLink: {
            type: String,
            required: true,
        },
        playStoreLink: {
            type: String,
            required: true,
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

const AppVersionDocument = mongoose.model<AppVersionDocument>("app-versions", AppVersionDocumentSchema);

export default AppVersionDocument;