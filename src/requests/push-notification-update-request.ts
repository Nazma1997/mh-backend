import { body } from "express-validator";

const PushNotificationUpdateRequest: any = [
    body("uuid").exists().trim().isString().withMessage('Uuid is required'),
    body("fcmToken").exists().trim().isString().withMessage('Fcm token is required'),
    body("platform").exists().trim().isString().withMessage('Platform is required')
];

export default PushNotificationUpdateRequest;