import mongoose, { ConnectOptions } from "mongoose";
import config from "config";

import logger from "../utils/logger";

const createDBConnection = async () => {

    const NODE_ENV = config.get<string>("NODE_ENV");
    const MONGO_USER = config.get<string>("MONGO_USER");
    const MONGO_PASSWORD = config.get<string>("MONGO_PASSWORD");
    const MONGO_CLUSTER = config.get<string>("MONGO_CLUSTER");
    const MONGO_DB_NAME = config.get<string>("MONGO_DB_NAME");
    const MONGO_PORT = config.get<number>("MONGO_PORT");

    const mongoConnectionUri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/${MONGO_DB_NAME}?retryWrites=true&w=majority`;
    const mongoDbConnectionURI = NODE_ENV === "local_development" ? `mongodb://localhost:${MONGO_PORT}/${MONGO_DB_NAME}` : (NODE_ENV === "development" ? mongoConnectionUri : mongoConnectionUri);



    
    // const localConnection = "mongodb://localhost:27017/mhapp";
    // const cloudConnection = "mongodb+srv://mircoHospitality:@cluster0.ao2qrau.mongodb.net/mircoHospitality?retryWrites=true&w=majority";

    // testinf purpose 
    // const mongoConnectionUri = 'mongodb://localhost:27017/aws'
    try {
        
        mongoose.set('strictQuery', false);

        await mongoose.connect(mongoConnectionUri, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions);
        logger.info("Database connected successfully!");

    } catch (error) {
        logger.error("Could not connect to database");
        process.exit(1);
    }
};

export default createDBConnection;
