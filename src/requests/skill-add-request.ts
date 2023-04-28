import { body } from "express-validator";
import { skillAlreadyIsNotExists } from "../services/skill-service";

const SkillAddRequest: any = [
    body("name").exists().trim().isString().withMessage('Name is required').custom((value: string, { req }) => {
        return skillAlreadyIsNotExists(req.body.name);
    }),
    body("active").exists().isBoolean().withMessage('Status is required')
];

export default SkillAddRequest;