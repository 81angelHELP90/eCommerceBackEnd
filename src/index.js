const express = require("express");
const app = express();

//Setter port
app.set("PORT", process.env.PORT || 6666);

//Middelwares
app.use(express.json());
//Format data:
app.use(express.urlencoded({extended: true}));

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

let number = null

console.log(typeof number)

app.listen(app.get("port"), () => { console.log("ecommerce-backend run in port ", app.get("PORT")) });