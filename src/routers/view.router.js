import { Router } from "express";
export const router = Router();
import ProductManagerdb from "../productManagerDBHelper.js";
const productManager = new ProductManagerdb();

router.get("/", async (req, res) => {
    let title = "Productos";
    let allProducts = await productManager.getProducts();
    let arrayProducts = allProducts.map(product => product._doc);

    res.setHeader("Content-type", "text/html");
    res.status(200).render("home", { arrayProducts, title });
});

router.get("/test/:pid", async (req, res) => {
    res.setHeader("Content-type", "text/html");
    res.status(200).render("addProducts", { });
});

router.get("/realtmeproducts", async (req, res) => {
    let title = "Prod. Actualizados";
    let allProducts = await productManager.getProducts();
    let arrayProducts = allProducts.map(product => product._doc);

    res.setHeader("Content-type", "text/html");
    res.status(200).render("realTimeProducts", { arrayProducts, title });
});
