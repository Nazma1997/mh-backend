import { body } from "express-validator";
import { shortListAlreadyIsNotExists } from "../services/short-list-service";

const ShortListAddRequest: any = [
    body("employeeId").exists().notEmpty().isMongoId().withMessage('Employee is required').custom((value: string, { req }) => {
        return shortListAlreadyIsNotExists(req.body.employeeId, req.user._id);
    }),
];

export default ShortListAddRequest;