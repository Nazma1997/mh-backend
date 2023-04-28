import { Router } from "@awaitjs/express";

import userRouter from "./user-routes";
import positionRouter from "./position-routes";
import sourceRouter from "./source-routes";
import skillRouter from "./skill-routes";
import commonRouter from "./common-routes";
import shortListRouter from "./short-list-routes";
import termsConditionRouter from "./terms-condition-routes";
import hiredHistoryRouter from "./hired-history-routes";
import currentHiredEmployeeRouter from "./current-hired-employee-routes";
import appErrorRouter from "./app-error-routes";
import appVersionRouter from "./app-version-routes";
import checkInCheckOutHistoryRouter from "./check-in-check-out-history-routes";
import conversationRouterRouter from "./conversation-routes";
import messageRouter from "./message-routes";
import requestEmployeeRouter from "./request-employee-routes";
import path from 'path';

const router = Router();

router.use("/api/v1/users", userRouter);
router.use("/api/v1/positions", positionRouter);
router.use("/api/v1/sources", sourceRouter);
router.use("/api/v1/skills", skillRouter);
router.use("/api/v1/commons", commonRouter);
router.use("/api/v1/short-list", shortListRouter);
router.use("/api/v1/terms-conditions", termsConditionRouter);
router.use("/api/v1/hired-histories", hiredHistoryRouter);
router.use("/api/v1/current-hired-employees", currentHiredEmployeeRouter);
router.use("/api/v1/app-errors", appErrorRouter);
router.use("/api/v1/app-versions", appVersionRouter);
router.use("/api/v1/check-in-check-out-histories", checkInCheckOutHistoryRouter);
router.use("/api/v1/conversations", conversationRouterRouter);
router.use("/api/v1/messages", messageRouter);
router.use("/api/v1/request-employees", requestEmployeeRouter);

router.getAsync("/", async (req, res, next) => {
    // res.send("MH backend health is now ok");
    // console.log("__dirname; ", __dirname + "/index.html");
    // return res.sendFile(__dirname + "/index.html");

    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <h2>MH backend health is now ok</h2>
    
        <button>Send</button>
    
        <script src="https://cdn.socket.io/4.6.0/socket.io.min.js"
            integrity="sha384-c79GN5VsunZvi+Q/WObgk2in0CbZsHnjEqvFxC5DxHn9lTfNce2WW6h2pH6u/kF+"
            crossorigin="anonymous"></script>
        <script>
            const socket = io();
        </script>
    </body>
    </html>`);
});

router.route("*").all(async (req, res, next) => {
    res.send("404 Not Found!");
});

export default router;
