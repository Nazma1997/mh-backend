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
exports.getUserInfoBasedOnPushNotificationInfo = exports.sendPushNotificationInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const user_service_1 = require("./user-service");
const sendPushNotificationInfo = (fcmToToken, title, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = "https://fcm.googleapis.com/fcm/send";
        const authorizationKey = 'key=AAAAwaSQwc4:APA91bH5pzh_j3LHx3O2oKcn557nkJ6juoizHpe-ltzai3t1I2ChyzYSXLK3g_LZBNP1MiYHS_Wll3x0ED1Tj9zCAaA8G5jeY_qHsq_Zx7RiO-cdS2Mu6H-az-WbrGwBfsCdO8NRohNg';
        const headerData = { 'Content-Type': 'application/json', 'Authorization': authorizationKey };
        const bodyData = {
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
            const internalResponse = yield axios_1.default.post(url, bodyData, { headers: headerData });
        }
    }
    catch (error) {
        throw error;
    }
});
exports.sendPushNotificationInfo = sendPushNotificationInfo;
const getUserInfoBasedOnPushNotificationInfo = (query, notificationData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = yield (0, user_service_1.getUserInfoByFilterQuery)(query);
        if (userInfo && userInfo.pushNotificationDetails && userInfo.pushNotificationDetails.fcmToken && notificationData && notificationData.title && notificationData.body) {
            yield (0, exports.sendPushNotificationInfo)(userInfo.pushNotificationDetails.fcmToken, notificationData.title, notificationData.body);
        }
    }
    catch (error) {
        throw error;
    }
});
exports.getUserInfoBasedOnPushNotificationInfo = getUserInfoBasedOnPushNotificationInfo;
