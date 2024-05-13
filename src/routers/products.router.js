
const express = require("express");
const router = express.Router();
const ProductManagerdb = require("../productManagerDBHelper.js");
const productManager = new ProductManagerdb();

//Metodos BBDD
router.post("/", async (req, res) => {
    try {
        const newProduct = req.body;
        let insertedProduct = await productManager.insertProducs(newProduct);
        
        insertedProduct.status === "success" ? res.status(201).json({ status: "success", payload: insertedProduct.payload }) : res.status(401).json({ status: "error", message: insertedProduct.message });
    } catch (error) {
        console.log(`Error al agregar producto: ${error}`);
        res.status(400).json({ status: "error", message: "Error al intentar guardar" });
    }
});

router.get("/", async (req, res) => {
    try {
        const { limit } = req.query;
        let _limit = isNaN(parseInt(limit)) ? 0 : parseInt(limit);
        let listProducts = await productManager.getProducts(_limit);
    
        res.status(200).json({ status: "success", payload: listProducts });
    } catch (error) {
        res.status(400).json({ status: "error", message: "Error al intentar guardar" });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        let productId = parseInt(req.params.pid);

        if (!isNaN(productId)) {
            let product = await productManager.getProductById(productId);

            res.status(200).json({ success: true, payload: product });
        } else
            res.status(500).json({ error: true, Message: "Id no valido" })
    } catch (error) {
        res.status(400).json({ status: "error", message: "Error al intentar guardar" });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const updateId = req.params.pid;
        const fieldsToUpdate = req.body;
        let productId = parseInt(updateId);

        if (!isNaN(productId)) {
            let product = await productManager.upDateProducts(productId, ...fieldsToUpdate);

            res.status(200).json({ success: true, payload: product });
        } else
            res.status(500).json({ error: true, Message: "Id no valido" })
    } catch (error) {
        console.log(`Error al actualizar producto: ${error}`);
        res.status(501).json({ error: true, Message: "Error al actualizar" });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        let productId = parseInt(req.params.pid);

        if (!isNaN(productId)) {
            let product = await productManager.deleteProducts(productId);

            res.status(200).json({ success: true, payload: product });
        } else
            res.status(500).json({ error: true, Message: "El id no es valido" });
    } catch (error) {
        console.log(`Error al eliminar producto: ${error}`);
        res.status(501).json({ error: true, Message: "Error al eliminar producto" });
    }
});

module.exports = router;