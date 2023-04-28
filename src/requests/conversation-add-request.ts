import { body } from "express-validator";

const ConversationAddRequest: any = [
    body("senderId").exists().trim().isMongoId().withMessage('Sender is required'),
    body("receiverId").exists().trim().isMongoId().withMessage('Receiver is required'),
];

export default ConversationAddRequest;