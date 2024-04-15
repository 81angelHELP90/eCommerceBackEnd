import { Router } from "express";
import productManager from "../productManagerHelper.js";
const Product = new productManager("./products.json");

export const router = Router();

router.get("/", async (req, res) => {
    let title = "Productos";
    const listProducts = await Product.getProducts();

    res.setHeader("Content-type", "text/html");
    res.status(200).render("home", { listProducts, title });
});

router.get("/test/:pid", async (req, res) => {
    res.setHeader("Content-type", "text/html");
    res.status(200).render("addProducts", { });
});

router.get("/realtmeproducts", async (req, res) => {
    let title = "Prod. Actualizados";
    const listProducts = await Product.getProducts();

    res.setHeader("Content-type", "text/html");
    res.status(200).render("realTimeProducts", { listProducts, title });
});
