import express from "express";
const app = express();
import { router as productsRouter } from './routers/products.router.js';
import { router as cartsRouter } from './routers/carts.router.js';
import { router as sessionsRouter } from './routers/sessions.router.js';
import { router as usersRouter } from './routers/users.router.js';
import { router as viewRouter }from "./routers/view.router.js";
import passport from 'passport';
import initPassport from './config/passport.config.js';
import {Server} from "socket.io";
import {engine} from 'express-handlebars';
import cookieParser from "cookie-parser";
import sessions from "express-session";
import path from "path";
import __dirname from "./utils.js";
import mongooseConnect from "mongoose";
import config from "./config/config.js";
import { logger, middleLogger } from "./helpers/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Documentación ecommers backend",
            version: "1.0.0",
            desciption: "Documentación relacionada a los productos y carrito de compras del backend ecommers"
        }
    },
    apis: ["./src/docs/*.yaml"] 
}

const spec = swaggerJSDoc(swaggerOptions);

app.use(express.json()); 
app.use(middleLogger);
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/front/public")));

app.use(sessions({
    secret: "Hash#Hash123", resave: true, saveUninitialized: true
}));

initPassport();
app.use(passport.initialize());
app.use(passport.session()); 

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/front/views")); 

app.use(cookieParser());
app.use("/api/products", (req, res, next) => {
    req.io = io
    next();
}, productsRouter);

app.use("/api/carts", cartsRouter);

app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);

app.use("/", viewRouter);

app.use("/apiDocs", swaggerUiExpress.serve, swaggerUiExpress.setup(spec));

const serverHttp = app.listen(8080, function () { logger.info("Server run in port 8080 | " + "Environment: " + config.environment)} );

const dbConector = async () => {
    try {
        await mongooseConnect.connect(
            config.mongoUrl,
            {
                dbName: config.dbName
            }
        )
        logger.info("DB Conection OK");
    } catch (error) {
        logger.error("Conector db error: ", error);
    }
};

dbConector();

const io = new Server(serverHttp); 

export default io;



