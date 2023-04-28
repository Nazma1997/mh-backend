import mongoose from "mongoose";

export interface MessageDocument {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    text: String;
    active: Boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: mongoose.Types.ObjectId;
    senderDetails: typeof senderItemSchema,
    receiverDetails: typeof receiverItemSchema,
};

export interface MessageStatusDocument {
    id: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    active: Boolean;
    createdBy: mongoose.Types.ObjectId;
};

const senderItemSchema = new mongoose.Schema({
    senderId: mongoose.Types.ObjectId,
    name: String,
    profilePicture: String,
});

const receiverItemSchema = new mongoose.Schema({
    receiverId: mongoose.Types.ObjectId,
    name: String,
    profilePicture: String,
});

export const MessageSchema = new mongoose.Schema(
    {
        receiverId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        senderId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        senderDetails: senderItemSchema,
        receiverDetails: receiverItemSchema,
        text: {
            type: String,
            required: true,
        },
        dateTime: {
            type: Date,
            default: Date.now,
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

const Message = mongoose.model<MessageDocument>("messages", MessageSchema);

export default Message;