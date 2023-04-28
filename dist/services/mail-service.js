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
exports.sendEmailByAWS = exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("config"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
// create reusable transporter object using the default SMTP transport
const createtransporter = () => __awaiter(void 0, void 0, void 0, function* () {
    return nodemailer_1.default.createTransport({
        host: config_1.default.get("SMTP_HOST"),
        port: config_1.default.get("SMTP_PORT"),
        secure: false,
        auth: {
            user: config_1.default.get("SMTP_USER"),
            pass: config_1.default.get("SMTP_PASSWORD"), // generated ethereal password
        },
    });
});
const sendMail = (toEmail, subject, htmlContent, plainText, fromEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = yield createtransporter();
    const from = fromEmail ? fromEmail : "MH <" + config_1.default.get("SYSTEM_DEFAULT_EMAIL_ADDRESS") + ">";
    const emailData = {
        from: from,
        to: toEmail,
        subject: subject,
        html: htmlContent // html body
    };
    if (plainText)
        emailData.text = plainText; // plain text body
    // send mail with defined transport object
    try {
        //console.log("before send emailData:",emailData);
        const sendInfo = yield transporter.sendMail(emailData);
        //console.log("after send sendInfo:",sendInfo);
        return sendInfo;
    }
    catch (err) {
        throw err;
    }
});
exports.sendMail = sendMail;
const sendEmailByAWS = (toEmail, subject, htmlContent, plainText) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        aws_sdk_1.default.config.update({
            accessKeyId: config_1.default.get("AWS_SES_ACCESS_KEY_ID"),
            secretAccessKey: config_1.default.get("AWS_SES_SECRET_ACCESS_KEY"),
            region: config_1.default.get("AWS_SES_REGION")
        });
        const ses = new aws_sdk_1.default.SES({ apiVersion: "2010-12-01" });
        const params = {
            Destination: {
                ToAddresses: [toEmail] // Email address/addresses that you want to send your email
            },
            ConfigurationSetName: "LDS_SES",
            Message: {
                Body: {
                    Html: {
                        // HTML Format of the email
                        Charset: "UTF-8",
                        Data: htmlContent
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: plainText
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: subject
                }
            },
            Source: config_1.default.get("AWS_SES_SOURCE")
        };
        return yield ses.sendEmail(params).promise();
    }
    catch (err) {
        console.log("AWS Email send error: ", err);
    }
});
exports.sendEmailByAWS = sendEmailByAWS;
