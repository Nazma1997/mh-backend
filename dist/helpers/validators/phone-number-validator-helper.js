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
exports.isPhoneNumberValid = void 0;
const validation_rule_helper_1 = require("../validation-rule-helper");
const isPhoneNumberValid = (phone, countryCode) => __awaiter(void 0, void 0, void 0, function* () {
    const country = yield (0, validation_rule_helper_1.getValidationRulesByCountryCode)(countryCode);
    if (country) {
        //@ts-ignore
        const dialCode = country.dial_code.substring(1);
        const prefix = phone.substring(0, dialCode.length);
        const subscriberNumber = phone.substring(dialCode.length).trim();
        if (dialCode && dialCode === prefix && subscriberNumber.length >= 4 && subscriberNumber.length <= 15)
            return true;
        else
            throw new Error("Phone Number is not valid for the given country!");
    }
    else {
        throw new Error("Phone Number is not valid for the given country!");
    }
});
exports.isPhoneNumberValid = isPhoneNumberValid;
