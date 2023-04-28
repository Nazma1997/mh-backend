import { body } from "express-validator";
import { positionAlreadyIsNotExists } from "../services/position-service";

const PositionAddRequest: any = [
    body("name").exists().trim().isString().withMessage('Name is required').custom((value: string, { req }) => {
        return positionAlreadyIsNotExists(req.body.name);
    }),
    body("active").exists().isBoolean().withMessage('Status is required')
];

export default PositionAddRequest;