import express, { Express } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import config from "config";

import dbConnection from "./db-connection/db-connection";
import { errorHandler } from "./middleware/error-handler";
import logger from "./utils/logger";
import router from "./routes/index";
const app: Express = express();
const https = require('https');
const fs = require('fs');

// const options = {
//   key: fs.readFileSync('path/to/private.key'),
//   cert: fs.readFileSync('path/to/certificate.crt')
// };

// const httpsServer = https.createServer(options, app);

const httpServer = http.createServer(app);

// socket creation
const io: any = new Server(httpServer);

//@ts-ignore
global.io = io;

io.on('connection', function (socket: any) {
    console.log("New User Connected");
});

// app.use(cors());
// Configure cors middleware
app.use(cors({
    origin: "*", // replace * with your allowed origin or list of allowed origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: "Content-Type, Authorization",
  }));
  
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());

dbConnection();

//add routes
app.use(router);

// Handling Errors
app.use(errorHandler);

const port = config.get<number>('PORT');

httpServer.listen(port, async () => {
    logger.info(`Application successfully connected on http://localhost:${port}`);
});