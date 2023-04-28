import nodemailer from "nodemailer";
import config from "config";
import AWS from "aws-sdk";

// create reusable transporter object using the default SMTP transport
const createtransporter = async () => {
    return nodemailer.createTransport({
        host: config.get<string>("SMTP_HOST"), //smtp.ethereal.email
        port: config.get<number>("SMTP_PORT"), //587
        secure: false, // true for 465, false for other ports
        auth: {
            user: config.get<string>("SMTP_USER"), // generated ethereal user
            pass: config.get<string>("SMTP_PASSWORD"), // generated ethereal password
        },
    });
};

export const sendMail = async (toEmail: string, subject: string, htmlContent?: (string | null), plainText?: (string | null), fromEmail?: (string | null)) => {
    const transporter = await createtransporter();

    const from = fromEmail ? fromEmail : "MH <" + config.get<string>("SYSTEM_DEFAULT_EMAIL_ADDRESS") + ">";

    const emailData: any = {
        from: from, // sender address
        to: toEmail, // list of receivers
        subject: subject, // Subject line
        html: htmlContent // html body
    };

    if (plainText) emailData.text = plainText; // plain text body

    // send mail with defined transport object
    try {
        //console.log("before send emailData:",emailData);
        const sendInfo = await transporter.sendMail(emailData);
        //console.log("after send sendInfo:",sendInfo);
        return sendInfo;
    } catch (err: any) {
        throw err;
    }
};

export const sendEmailByAWS = async (toEmail: string, subject: string, htmlContent: string, plainText: string) => {
    try {
        AWS.config.update({
            accessKeyId: config.get<string>("AWS_SES_ACCESS_KEY_ID"),
            secretAccessKey: config.get<string>("AWS_SES_SECRET_ACCESS_KEY"),
            region: config.get<string>("AWS_SES_REGION")
        });

        const ses = new AWS.SES({ apiVersion: "2010-12-01" });
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
            Source: config.get<string>("AWS_SES_SOURCE")
        };

        return await ses.sendEmail(params).promise();

    } catch (err: any) {
        console.log("AWS Email send error: ", err);
    }
};