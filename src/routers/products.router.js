import express from "express";
export const router = express.Router();
import ProductManagerdb from "../productManagerDBHelper.js";
const productManager = new ProductManagerdb();
import io from "../app.js";

//Metodos BBDD

//Insertar producto
router.post("/", async (req, res) => {
    try { //requeridos descripcion - cod- precio
        const newProduct = req.body;
        let insertedProduct = await productManager.insertProducs(newProduct);
        
        if(insertedProduct.status === "success") {
            //SOCKET: 
            let allProducts = await productManager.getProducts();
            let arrayProducts = allProducts.map(product => product._doc);
            
            io.emit("addProducs", arrayProducts);
            res.status(201).json({ status: "success", payload: insertedProduct.payload });
        } else
            res.status(401).json({ status: "error", message: insertedProduct.message });
    } catch (error) {
        console.log(`Error al agregar producto: ${error}`);
        res.status(500).json({ status: "error", message: "Error al intentar guardar" });
    }
});

//Obtener todos los productos | Ejemplos: limit=5 - 
router.get("/", async (req, res) => {
    try {
        const { limit, page, sort } = req.query;
        let listProducts = await productManager.getProducts(limit, page, sort);

        res.status(201).json({ status: "success", payload: listProducts });
    } catch (error) {
        console.log("Error al al obtener los productos: ", error);
        res.status(500).json({ status: "error", message: "Error al al obtener los productos" });
    }
});

//Obtener un producto
router.get("/:pid", async (req, res) => {
    try {
        let productId = parseInt(req.params.pid);

        if (!isNaN(productId)) {
            let product = await productManager.getProductById(productId);

            res.status(201).json({ status: "success", payload: product });
        } else
            res.status(401).json({ status: "error", Message: "Id no valido" })
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al intentar guardar" });
    }
});

//Modificar un producto
router.put("/:pid", async (req, res) => {
    try {
        const updateId = req.params.pid;
        const fieldsToUpdate = req.body;
        let productId = parseInt(updateId);

        if (!isNaN(productId)) {
            let product = await productManager.upDateProducts(productId, ...fieldsToUpdate);

            res.status(201).json({ status: "success", payload: product });
        } else
            res.status(401).json({ status: "error", Message: "Id no valido" })
    } catch (error) {
        console.log(`Error al actualizar producto: ${error}`);
        res.status(500).json({ status: "error", Message: "Error al actualizar" });
    }
});

//Eliminar un producto
router.delete("/:pid", async (req, res) => {
    try {
        let productId = parseInt(req.params.pid);

        if (!isNaN(productId)) {
            //SOCKET: 
            //let _product = await productManager.getProductById(productId);
            //io.emit("removeProducs", _product);

            let product = await productManager.deleteProducts(productId);
            //SOCKET: 
            let allProducts = await productManager.getProducts();
            let arrayProducts = allProducts.map(product => product._doc);
            io.emit("removeProducs", arrayProducts);

            res.status(200).json({ status: "success", payload: product });
        } else
            res.status(401).json({ status: "error", Message: "El id no es valido" });
    } catch (error) {
        console.log(`Error al eliminar producto: ${error}`);
        res.status(500).json({ status: "error", Message: "Error al eliminar producto" });
    }
});