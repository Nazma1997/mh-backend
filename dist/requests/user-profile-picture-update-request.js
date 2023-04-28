"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
//check mandatory inputs for update userProfile info
const ProfilePictureUpdateRequest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, express_validator_1.body)("id").exists().trim().notEmpty().isMongoId().withMessage("User is required!").run(req);
    yield (0, express_validator_1.body)("profilePicture").exists().trim().notEmpty().isString().withMessage('Please upload your profile picture!').run(req);
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty())
        return result.array();
    return true;
});
exports.default = ProfilePictureUpdateRequest;
