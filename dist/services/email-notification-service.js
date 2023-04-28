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
exports.addEmailNotificationInfo = void 0;
const config_1 = __importDefault(require("config"));
const mail_service_1 = require("../services/mail-service");
//Add email notification info to Database
const addEmailNotificationInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inputData = req.body;
        //@ts-ignore 
        const loggedInUserInfo = req.user;
        let plainContent = "Forgot password";
        if (loggedInUserInfo && loggedInUserInfo._id)
            inputData.createdBy = loggedInUserInfo._id;
        inputData.fromEmail = config_1.default.get("SYSTEM_DEFAULT_EMAIL_ADDRESS");
        inputData.toEmail = req.body.email;
        inputData.status = 'new';
        inputData.subject = req.body.subject || 'Verify Your Email Address | ' + config_1.default.get("APPLICATION_SHORT_NAME");
        //using aws ses service
        const emailInfo = yield (0, mail_service_1.sendEmailByAWS)(inputData.toEmail.toString(), inputData.subject.toString(), inputData.content.toString(), plainContent);
        //using mendril
        //const sendInfo = await sendMail(emailInfo.toEmail.toString(), emailInfo.subject.toString(), emailInfo.content.toString());
        return emailInfo;
    }
    catch (err) {
        throw err;
    }
});
exports.addEmailNotificationInfo = addEmailNotificationInfo;
