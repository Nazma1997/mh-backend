import { body } from "express-validator";

const MessageAddRequest: any = [
    body("receiverId").exists().trim().isMongoId().withMessage('Receiver is required'),
    body("senderId").exists().trim().isMongoId().withMessage('Sender is required'),
    body("text").exists().trim().isString().withMessage('Text is required'),
];

export default MessageAddRequest;