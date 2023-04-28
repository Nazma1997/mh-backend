import { body } from "express-validator";
import { skillAlreadyIsNotExists } from "../services/skill-service";

const SkillUpdateRequest: any = [
    body("id").exists().trim().isMongoId().withMessage('Skill is required'),
    body("name").exists().trim().isString().withMessage('Name is required').custom((value: string, { req }) => {
        return skillAlreadyIsNotExists(req.body.name, req.body.id);
    }),
    body("active").exists().isBoolean().withMessage('Status is required')
];

const SkillUpdateStatusRequest: any = [
    body("id").exists().trim().isMongoId().withMessage('Skill is required'),
    body("active").exists().isBoolean().withMessage('Status is required')
];

export { SkillUpdateRequest, SkillUpdateStatusRequest };