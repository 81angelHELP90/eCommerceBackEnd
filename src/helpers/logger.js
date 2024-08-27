import winston from "winston";
import config from "../config/config.js";


const loggerDev = new winston.transports.Console({
    level: "debug", 
    format: winston.format.combine( 
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple()
    )
});

const loggerProd = new winston.transports.Console({
    level: "info", 
    format: winston.format.combine( 
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple()
    )
});

const loggerProdFile = new winston.transports.File({
    level: "error", 
    filename: "./src/errors.log", 
    format: winston.format.combine( 
        winston.format.timestamp(),
        winston.format.json()
    )
});

export const logger = winston.createLogger({});

if(config.environment === "prod") {
    logger.add(loggerProd);
    logger.add(loggerProdFile);
} else
    logger.add(loggerDev);


export const middleLogger = (req, res, next) => {
    req.logger = logger; 
    next();
} 