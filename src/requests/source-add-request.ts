import { body } from "express-validator";
import { sourceAlreadyIsNotExists } from "../services/source-service";

const SourceFromAddRequest: any = [
    body("name").exists().trim().isString().withMessage('Name is required').custom((value: string, { req }) => {
        return sourceAlreadyIsNotExists(req.body.name);
    }),
    body("active").exists().isBoolean().withMessage('Status is required')
];

export default SourceFromAddRequest;