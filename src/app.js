import express from "express";
const app = express();
import { router as productsRouter } from './routers/products.router.js';
import { router as cartsRouter } from './routers/carts.router.js';
import { router as sessionsRouter } from './routers/sessions.router.js';
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

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Middelwares:
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/front/public")));

app.use(sessions({
    secret: "Hash#Hash123", resave: true, saveUninitialized: true
}));

//Paso: 2
initPassport();
app.use(passport.initialize());
app.use(passport.session());  //Si usamos session como estrategia 

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

app.use("/", viewRouter);

const serverHttp = app.listen(8080, function () { console.log("Server run in port 8080"); });

//Db connection:
const dbConector = async () => {
    try {
        await mongooseConnect.connect(
            "mongodb+srv://vangel338:4rCed0KUi3oZ3E2A@cluster0.d3wk8bc.mongodb.net/?retryWrites=true&w=majority",
            {
                dbName:"BBDD_ecommerces_DH"
            }
        )
        console.log("DB Conection OK");
    } catch (error) {
        console.log("Conector db error: ", error);
    }
};

dbConector();

const io = new Server(serverHttp);

export default io;



