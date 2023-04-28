import { body } from "express-validator";
import { sourceAlreadyIsNotExists } from "../services/source-service";

const SourceUpdateRequest: any = [
    body("id").exists().trim().isMongoId().withMessage('Source from is required'),
    body("name").exists().trim().isString().withMessage('Name is required').custom((value: string, { req }) => {
        return sourceAlreadyIsNotExists(req.body.name, req.body.id);
    }),
    body("active").exists().isBoolean().withMessage('Status is required')
];

const SourceUpdateStatusRequest: any = [
    body("id").exists().trim().isMongoId().withMessage('Source from is required'),
    body("active").exists().isBoolean().withMessage('Status is required')
];

export { SourceUpdateRequest, SourceUpdateStatusRequest };