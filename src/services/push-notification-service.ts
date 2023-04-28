import axios from "axios";
import { getUserInfoByFilterQuery } from "./user-service";

export const sendPushNotificationInfo = async (fcmToToken: any, title: any, body: any) => {
    try {

        const url: any = "https://fcm.googleapis.com/fcm/send";
        const authorizationKey: any = 'key=AAAAwaSQwc4:APA91bH5pzh_j3LHx3O2oKcn557nkJ6juoizHpe-ltzai3t1I2ChyzYSXLK3g_LZBNP1MiYHS_Wll3x0ED1Tj9zCAaA8G5jeY_qHsq_Zx7RiO-cdS2Mu6H-az-WbrGwBfsCdO8NRohNg';
        const headerData: any = { 'Content-Type': 'application/json', 'Authorization': authorizationKey };

        const bodyData: any = {
            to: fcmToToken,
            notification: {
                body: body,
                title: title
            },
            data: {
                priority: "high",
                content_available: true
            }
        };

        if (url && headerData && bodyData) {
            const internalResponse = await axios.post(url, bodyData, { headers: headerData });
        }

    } catch (error) {
        throw error;
    }
};

export const getUserInfoBasedOnPushNotificationInfo = async (query: any, notificationData: any) => {
    try {
        const userInfo: any = await getUserInfoByFilterQuery(query);

        if (userInfo && userInfo.pushNotificationDetails && userInfo.pushNotificationDetails.fcmToken && notificationData && notificationData.title && notificationData.body) {
            await sendPushNotificationInfo(userInfo.pushNotificationDetails.fcmToken, notificationData.title, notificationData.body);
        }

    } catch (error) {
        throw error;
    }
};