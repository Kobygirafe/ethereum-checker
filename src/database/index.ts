import {Sequelize} from "sequelize";
import {ConfigService} from "../config/service";

const config = new ConfigService();
config.loadConfiguration();

const DB_NAME = config.getDB().name || 'eth';
const DB_USER = config.getDB().user || 'user';
const DB_PASS = config.getDB().pass || 'password';
const DB_PORT = config.getDB().port || 3306;
const DB_HOST = config.getDB().host || 'localhost';

export const dbConnect = new Sequelize(
    (DB_NAME),
    (DB_USER),
    (DB_PASS),
    {
        logging: false,
        port: DB_PORT || 3306,
        host: DB_HOST || "localhost",
        dialect: "mysql",
        pool: {
            min: 0,
            max: 5,
            acquire: 30000,
            idle: 10000,
        },
        retry: {
            match: [
                /SequelizeConnectionError/,
                /SequelizeConnectionRefusedError/,
                /SequelizeHostNotFoundError/,
                /SequelizeHostNotReachableError/,
                /SequelizeInvalidConnectionError/,
                /SequelizeConnectionTimedOutError/,
            ],
            max: Infinity,
        },
    }
);