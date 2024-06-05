import { Router } from "express";
export const router = Router();
import ProductManagerdb from "../productManagerDBHelper.js";
import auth from "../middleware/auth.js"
const productManager = new ProductManagerdb();
import CartManagerdb from "../cartsManagerDBHelper.js";
const cartManager = new CartManagerdb();
import { passPortCall } from "../utils.js";
import jwt from "jsonwebtoken";

//Vista Home:
router.get("/", (req, res) => {
    let title = "Home";
   
    res.status(200).render("home", { title });
});

//Vista Login
router.get("/login", (req, res) => {
    let title = "Ingreso...";

    res.status(200).render("login", { title });
});
//Vista Registro
router.get("/registro", (req, res) => {
    let title = "Registro";

    res.status(200).render("registro", { title });
});

//Vista Perfil: middleware auth para session | middleware passPortCall para JWT
router.get("/perfil", passPortCall("current"), (req, res) => {
    let title = "Perfil";
    //Para cuando uso session: let usuario = req.session.usuario;
    let usuario = req.user //Para JWT:

    res.status(200).render("perfil", { title, usuario });
});

//Vista Productos: middleware auth para session | middleware passPortCall para JWT
router.get("/Productos", passPortCall("current"), async (req, res) => {
    let title = "Productos";
    
    let allProducts = await productManager.getProducts();
    let arrayProducts = allProducts.map(product => product._doc);

    
    let cart = {
        //Para cuando uso session: _id: req.session.usuario.cart
        _id: req.user.cart //Para JWT:
        
    }

    res.setHeader('Content-type','text/html');
    res.status(200).render("products", { arrayProducts, title,  cart});
});

//Vista Cart:  middleware auth para session | middleware passPortCall para JWT
router.get("/cart/:id", passPortCall("current"), async (req, res) => {
    let title = "Carrito";
    
    //Para cuando uso session: let cartId =  req.session.usuario.cart;
    let cartId = req.user.cart //Para JWT:

    res.status(200).render("cart", { title, cartId });
});

//Cambios en Productos
router.get("/realtmeproducts", async (req, res) => {
    let title = "Prod. Actualizados";
    let allProducts = await productManager.getProducts();
    let arrayProducts = allProducts.map(product => product._doc);

    res.setHeader("Content-type", "text/html");
    res.status(200).render("realTimeProducts", { arrayProducts, title });
});

//Vista Error
router.get("/error", (req, res) => {
    let error = "Error...!"
    res.status(401).render("error", { error});
});



