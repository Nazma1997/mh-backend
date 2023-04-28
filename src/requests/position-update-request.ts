import { body } from "express-validator";
import { positionAlreadyIsNotExists } from "../services/position-service";

const PositionUpdateRequest: any = [
    body("id").exists().trim().isMongoId().withMessage('Position is required'),
    body("name").exists().trim().isString().withMessage('Name is required').custom((value: string, { req }) => {
        return positionAlreadyIsNotExists(req.body.name, req.body.id);
    }),
    body("active").exists().isBoolean().withMessage('Status is required')
];

const PositionUpdateStatusRequest: any = [
    body("id").exists().trim().isMongoId().withMessage('Position is required'),
    body("active").exists().isBoolean().withMessage('Status is required')
];

export { PositionUpdateRequest, PositionUpdateStatusRequest };