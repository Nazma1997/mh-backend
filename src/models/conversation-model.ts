import mongoose from "mongoose";

export interface ConversationDocument {
    members: [mongoose.Types.ObjectId];
    active: Boolean;
    createdAt: Date;
    updatedAt: Date;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
};

export interface ConversationStatusDocument {
    id: mongoose.Types.ObjectId;
    active: Boolean;
    createdBy: mongoose.Types.ObjectId;
};

//simillar to chat model
export const ConversationSchema = new mongoose.Schema(
    {
        members: [mongoose.Types.ObjectId],
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

const Conversation = mongoose.model<ConversationDocument>("conversations", ConversationSchema);

export default Conversation;