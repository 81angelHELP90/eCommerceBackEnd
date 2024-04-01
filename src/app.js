const express = require("express");
const app = express();
const productsRouter = require('./routers/products.router.js');
//const cartsRouter = require('./routers/carts.router.js');

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

app.use("/api/products", productsRouter);
//app.use("/api/carts", cartsRouter);

app.listen(8080, function () { console.log("Server run in port 8080"); });