import { Router } from "express";
export const router = Router();
import ProductManagerdb from "../productManagerDBHelper.js";
import auth from "../middleware/auth.js"
const productManager = new ProductManagerdb();
import CartManagerdb from "../cartsManagerDBHelper.js";
const cartManager = new CartManagerdb();

//Vista Home:
router.get("/", (req, res) => {
    let title = "Home";
   
    res.status(200).render("home", { title });
});

//Vista Login
router.get("/login", (req, res) => {
    let title = "Ingreso";

    res.status(200).render("login", { title });
});
//Vista Registro
router.get("/registro", (req, res) => {
    let title = "Registro";

    res.status(200).render("registro", { title });
});

//Vista Perfil
router.get("/perfil", auth, (req, res) => {
    let title = "Perfil";
    let usuario = req.session.usuario;
    res.status(200).render("perfil", { title, usuario });
});

//Vista Productos:
router.get("/Productos", auth, async (req, res) => {
    let title = "Productos";
    
    let allProducts = await productManager.getProducts();
    let arrayProducts = allProducts.map(product => product._doc);

    let cart = {
        _id: req.session.usuario.cart
    }

    res.setHeader('Content-type','text/html');
    res.status(200).render("products", { arrayProducts, title,  cart});
});

//Vista Cart: 
router.get("/cart/:id", auth, async (req, res) => {
    let title = "Carrito";
    let cartId = req.session.usuario.cart;

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
