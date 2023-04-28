import { body } from "express-validator";

//Validate input for mandatory fields
const HiredHistoryAddRequest: any = [
    body("selectedShortlist").exists().notEmpty().isArray().withMessage("Selected short list are required"),
];

export default HiredHistoryAddRequest;