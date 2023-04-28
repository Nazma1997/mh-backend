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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidationRulesByCountryCode = void 0;
const lodash_1 = __importDefault(require("lodash"));
const phone_postcode_validation_rules_1 = __importDefault(require("../utils/static/phone-postcode-validation-rules"));
const getValidationRulesByCountryCode = (countryCode) => __awaiter(void 0, void 0, void 0, function* () {
    return lodash_1.default.find(phone_postcode_validation_rules_1.default, (info) => {
        return info && info.code === countryCode;
    });
});
exports.getValidationRulesByCountryCode = getValidationRulesByCountryCode;
