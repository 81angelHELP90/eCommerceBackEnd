/*
const express = require("express");
const router = express.Router();
const fs = require("fs");
const ValidationCartsHandler = require("../helpers/cart.validation.js");
const cartValidations = new ValidationCartsHandler("../carts.json");
const CartManager = require("../cartsManagerHelper.js");
const Cart = new CartManager("./carts.json");

const CartManagerdb = require("../cartsManagerDBHelper.js");
const cartManager = new CartManagerdb();
*/

import express from "express";
export const router = express.Router();
import CartManagerdb from "../cartsManagerDBHelper.js";
const cartManager = new CartManagerdb();

//Metodos BBDD
router.post("/", async (req, res) => {
    try {
        let insertedCart = await cartManager.insertCart();
        
        if(insertedCart.success)
            res.status(201).json({ status: "success", payload: "Carrito creado correctamente!" });
        else
            res.status(501).json({ status: "Error", Message: "Error al intentar guardar" });
    } catch (error) {
        console.log(`Error al agregar producto: ${error}`);
        res.status(401).json({ status: "error", message: "Error al intentar guardar" });
    }
});

router.post("/:cid/products/:pid", async (req, res) => {
    try {
        let { cid, pid } = req.params;
        let idCart = parseInt(cid);
        let idProduct = parseInt(pid);

        if (!isNaN(idCart))
            if (!isNaN(idProduct)) {
                let insertedProduct = await cartManager.insertProductsInCart(idCart, idProduct);
        
                if(insertedProduct.success)
                    res.status(201).json({ status: "success", payload: insertedProduct.payload });
                else
                    res.status(501).json({ status: "Error", Message: insertedProduct.payload});
            } else 
                res.status(501).json({ error: true, Message: "El id del producto no es valido" });
        else 
            res.status(501).json({ error: true, Message: "El id del carrito no es valido" });
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: true, Message: "Error al agregar el producto." });
    }

});

router.get("/:cid", async (req, res) => {
    try {
        let { cid} = req.params;
        let idCart = parseInt(cid);

        if (!isNaN(idCart)) {
            let Cart = await cartManager.getCartById(idCart);
        
            if(Cart.success)
                res.status(201).json({ status: "success", Cart });
            else
                res.status(501).json({ status: "Error", Message: Cart.message});
        } else 
            res.status(501).json({ error: true, Message: "El id del carrito no es valido" });       
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: true, Message: "Error al obtener el carrito." });
    }
});

router.get("/", async (req, res) => {
    try {
        let Carts = await cartManager.getAllCarts();
        
        if(Carts.success)
            res.status(201).json({ status: "success", Carts });
        else
            res.status(501).json({ status: "Error", Message: Carts.message});
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: true, Message: "Error al obtener los carritos." });
    }
});

//module.exports = router;