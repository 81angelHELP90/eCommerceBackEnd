const express = require("express");
const app = express();
const productsRouter = require("./routers/products.router.js");
const cartsRouter = require("./routers/carts.router.js");
const viewRouter = require("./routers/view.router.js");
const { engine } = require("express-handlebars");
const { Server } = require("socket.io");
const path = require("path");

const mongooseConnect = require("mongoose");

let io


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

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/front/views")); 

app.use("/api/products", (req, res, next) => {
    req.io = io
    next();
}, productsRouter);
app.use("/api/carts", cartsRouter);
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

io = new Server(serverHttp);



