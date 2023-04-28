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
exports.isCurrentPassword = exports.isPasswordValid = void 0;
const user_service_1 = require("../../services/user-service");
const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).{8,30}$/;
const isPasswordValid = (password) => __awaiter(void 0, void 0, void 0, function* () {
    if (passwordRegex.test(password))
        return true;
    else
        throw new Error("Your password is weak. Password must contains at least one character and one digit.");
});
exports.isPasswordValid = isPasswordValid;
//check if the given password matches with current password in the database
const isCurrentPassword = (id, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_service_1.getUserInfoById)(id);
    if (!user) {
        throw new Error("Invalid user");
    }
    if (yield (0, user_service_1.comparePassword)(password, user.password)) {
        return true;
    }
    else
        throw new Error("Your current password is wrong! Try again!");
});
exports.isCurrentPassword = isCurrentPassword;
