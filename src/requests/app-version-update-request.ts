import { body } from "express-validator";

const AppappVersionRouterUpdateRequest: any = [
    body("appVersion").exists().trim().isString().withMessage('App version is required'),
    body("updateRequired").exists().isBoolean().withMessage('Update required is required')
];

export default AppappVersionRouterUpdateRequest;