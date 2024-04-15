/*13-04-2024
const express = require("express");
const router = express.Router();
const productManager = require("../productManagerHelper.js");
const Product = new productManager("./products.json");
const ValidationProductsHandler = require("../helpers/product.validation.js");
const fs = require("fs");
*/

import express from "express";
import productManager from "../productManagerHelper.js";
import ValidationProductsHandler from "../helpers/product.validation.js";
import fs from "fs";
import io from "../app.js"

const Product = new productManager("./products.json");
export const router = express.Router();

//Endpoints
router.get("/", async (req, res) => {
    const listProducts = await Product.getProducts();
    const { limit } = req.query;

    if (isNaN(parseInt(limit))) {
        (listProducts.Error) ? res.status(500).json({ Message: listProducts.Error }) : res.status(200).json({ success: true, products: listProducts });
    } else {
        if (parseInt(limit) < 0 || parseInt(limit) > listProducts.length)
            res.status(500).json({ error: true, Message: "No es posible devolver el limite requerido" })
        else
            res.status(200).json({ success: true, products: listProducts.slice(0, limit) });
    }
});

router.get("/:pid", async (req, res) => {
    const listProducts = await Product.getProducts();
    let productId = parseInt(req.params.pid);

    if (!isNaN(productId)) {
        let product = await Product.getProductById(parseInt(productId));
        (listProducts.Error) ? res.status(500).json({ error: true, Message: listProducts.Error }) : res.status(200).json({ success: true, products: product });
    } else
        res.status(500).json({ error: true, Message: "Id no valido" })
});

router.post("/", async (req, res) => {
    try {
        const newProduct = req.body;
        const productValidations = new ValidationProductsHandler(newProduct, "../products.json");
        let product = await productValidations.newProductValidation();

        if (!product.error) {
            for (let i = 0; i < newProduct.length; i++) {
                newProduct[i].id = Math.floor(Math.random() * (1000 - 1) + 1) //valor seudo-aleatorio entre 1 y 999
                product.listProducts.push(newProduct[i]);
            }
            
            const listProducts = await Product.getProducts();
            let list = listProducts.concat(product.listProducts);

            await fs.promises.writeFile(Product.path, await JSON.stringify(list, null, 3));

            //SOCKET: 
            io.emit("addProducs", product.listProducts);

            res.status(200).json({ success: true, message: "Producto agregado correctamente!" })
        } else {
            res.status(400).json({ error: true, message: product.message });
        }
    } catch (error) {
        console.log(`Error al agregar producto: ${error}`);
        res.status(400).json({ error: true, message: "Error al agregar producto." });
    }
});

router.put("/:pid", async (req, res) => {
    const listProducts = await Product.getProducts();
    const updateId = req.params.pid;
    const fieldsToUpdate = req.body;
   
    let id = parseInt(updateId);

    if (!isNaN(id)) {
        let index = await listProducts.findIndex(product => product.id === id);

        if (index !== -1) {
            await Object.entries(fieldsToUpdate[0])
                .forEach(([key, value], i) => {
                    Object.keys(listProducts[index]).forEach((productKey, j) => {
                        if (productKey !== "id" && productKey === key)
                            listProducts[index][key] = value;
                    });
                });

            await fs.promises.writeFile(Product.path, await JSON.stringify(listProducts, null, 3));
            
            res.status(200).json({ success: true, Message: "Producto actualizado" });
            
        } else
            res.status(500).json({ error: true, Message: "Producto no encontrado" });
    } else
        res.status(500).json({ error: true, Message: "El id no es valido" });
});

router.delete("/:pid", async (req, res) => {
    const listProducts = await Product.getProducts();
    let id = parseInt(req.params.pid);

    if (!isNaN(id)) {
        let product = await listProducts.filter(product => product.id === id);

        if(product.length === 1) {
            let filteredList = await listProducts.filter(product => product.id !== id);

            await fs.promises.writeFile(Product.path, await JSON.stringify(filteredList, null, 3));

            //SOCKET: 
            io.emit("removeProducs", filteredList);

            res.status(200).json({ success: true, Message: "Producto eliminado." });
        } else 
            res.status(500).json({ error: true, Message: "Producto no encontrado" });
    } else {
        res.status(500).json({ error: true, Message: "El id no es valido" });
    }
});

//export default router;
//module.exports = router;