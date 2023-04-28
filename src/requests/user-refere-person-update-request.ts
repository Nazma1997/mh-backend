import { body } from "express-validator";

const UserReferPersonUpdateRequest: any = [
    body("id").exists().trim().isMongoId().withMessage('Refer person is required'),
    body("isReferPerson").exists().isBoolean().withMessage('Status is required')
];

export default UserReferPersonUpdateRequest;