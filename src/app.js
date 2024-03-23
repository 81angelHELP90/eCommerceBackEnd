const express = require("express");
const app = express();
const productManager = require("./productManagerHelper");
const Product = new productManager("./products.txt");

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Endpoints
app.get("/products", async (req, res) => {
    const listProducts = await Product.getProducts();
    let { limit } = req.query;
    
    if(isNaN(parseInt(limit))) {
        (listProducts.Error) ? res.json({ status: 500, Message: listProducts.Error }) : res.json({ status: 200, products: listProducts });
    } else {
        if(parseInt(limit) < 0 || parseInt(limit) > listProducts.length) 
            res.json({ status: 500, Message: "No es posible devolver el limite requerido" })
        else 
            res.json({ status: 200, products: listProducts.slice(0, limit) });
    }

    
});

app.get("/products/:pid", async (req, res) => {
    const listProducts = await Product.getProducts();
    let productId = req.params.pid;

    if(productId) {
        let product = await Product.getProductById(parseInt(productId));
        (listProducts.Error) ? res.json({ status: 500, Message: listProducts.Error }) : res.json({ status: 200, products:  product });
    } else
        res.json({ status: 500, Message: "Producto no encontrado" }) 
});

app.listen(8080, function () { console.log("Server run in port 8080"); });