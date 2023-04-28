import { FilterQuery, DocumentDefinition, ObjectId } from "mongoose";
import { Request } from "express";

import _ from "lodash";
import config from "config";

import { sendMail, sendEmailByAWS } from "../services/mail-service";

//Add email notification info to Database
export const addEmailNotificationInfo = async (req: Request) => {
    try {
        const inputData: any = req.body;

        //@ts-ignore 
        const loggedInUserInfo = req.user;

        let plainContent: any = "Forgot password";

        if (loggedInUserInfo && loggedInUserInfo._id) inputData.createdBy = loggedInUserInfo._id;

        inputData.fromEmail = config.get<string>("SYSTEM_DEFAULT_EMAIL_ADDRESS");
        inputData.toEmail = req.body.email;
        inputData.status = 'new';
        inputData.subject = req.body.subject || 'Verify Your Email Address | ' + config.get<string>("APPLICATION_SHORT_NAME");


        //using aws ses service
        const emailInfo = await sendEmailByAWS(inputData.toEmail.toString(), inputData.subject.toString(), inputData.content.toString(), plainContent);

        //using mendril
        //const sendInfo = await sendMail(emailInfo.toEmail.toString(), emailInfo.subject.toString(), emailInfo.content.toString());

        return emailInfo;

    } catch (err: any) {
        throw err;
    }
};