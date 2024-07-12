import { productService } from "../services/productsService.js";
import io from "../app.js";
import { generateProducs } from "../utils.js"

import { CustomError } from "../handleErrors/customError.js";
import { TIPOS_ERROR } from "../handleErrors/EErrors.js";
import { insertNewProductError } from "../handleErrors/productsError.js";

/*
export const adminProducts = async (req, res) => {
    try {
        if(req.user) {
           
            res.setHeader('Content-type','text/html');
            res.status(200).render("adminProducts");
        } else 
            res.status(200).render("adminProducts");
    } catch (e) {
        console.log("Error ADMIN: ", e);
        res.status(401).render("error", { error: "Error ADMIN"});
    }
}
*/

//mock
export const getMockProducts = async (req, res) => {
    try {
        let products = await generateProducs();

        res.status(201).json({ status: "success", payload: products });
    } catch (e) {
        console.log("Error al obtener los productos: ", e);
        res.status(401).json("error", "Error al obtener los productos");
    }
}

export const getProducts = async (req, res) => {
    try {
        let title = "Productos";
        const { limit, page, sort } = req.query;
        let allProducts = await productService.getProducts(limit, page, sort);
        let products = allProducts.map(product => product._doc);

        //Desde el navegador:
        if(req.user) {
            let cart = { _id: req.user.cart }

            res.setHeader('Content-type','text/html');
            res.status(200).render("products", { products, title,  cart});
        } else 
            res.status(201).json({ status: "success", payload: products });
    } catch (e) {
        console.log("Error al obtener los productos: ", e);
        let error = "Error al obtener los productos"
        
        res.status(401).render("error", { error});
    }
}

//Admin:
export const getProductsAdmin = async (req, res) => {
    try {
        const { limit, page, sort } = req.query;
        let allProducts = await productService.getProducts(limit, page, sort);
        let products = allProducts.map(product => product._doc);
       
        //Desde el navegador:
        if(req.user) {
            res.setHeader('Content-type','text/html');
            res.status(200).render("productsAdmin", { products});
        } else 
            res.status(201).json({ status: "success", payload: products });
    } catch (e) {
        console.log("Error al obtener los productos: ", e);
        let error = "Error al obtener los productos"
        res.status(401).render("error", { error});
    }
}

export const insertProducs = async (req, res) => {
    try { 
        const newProduct = req.body;
        
        if(!newProduct.title || !newProduct.price) {
            req.logger.info("Faltan datos");
            req.logger.error("Ahora 1");
            CustomError.createError("Faltan datos", {newProduct}, insertNewProductError(req.body), TIPOS_ERROR.ARGUMENTOS_INVALIDOS);
        } else {
            let insertedProduct = await productService.insertProducs(newProduct);
        
            if(insertedProduct.status === "success") {
                //SOCKET: 
                let allProducts = await productService.getProducts();
                let arrayProducts = allProducts.map(product => product._doc);
                
                io.emit("addProducs", arrayProducts);
                res.status(201).json({ status: "success", payload: insertedProduct.payload });
            } else {
                req.logger.error(insertedProduct.message + "Ahora 2");
                res.status(401).json({ status: "error", message: insertedProduct.message });
            }
        }
    } catch (error) {
        req.logger.error(`Error al agregar producto: ${error}`);
        res.status(500).json({ status: "error", message: "Error al intentar guardar" });
    }
}

export const getProductById = async (req, res) => {
    try {
        let productId = parseInt(req.params.pid);

        if (!isNaN(productId)) {
            let product = await productService.getProductById(productId);

            res.status(201).json({ status: "success", payload: product });
        } else
            res.status(401).json({ status: "error", Message: "Id no valido" })
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al intentar guardar" });
    }
}

export const upDateProducts = async (req, res) => {
    try {
        const updateId = req.params.pid;
        const fieldsToUpdate = req.body;
        let productId = parseInt(updateId);

        if (!isNaN(productId)) {
            let product = await productService.upDateProducts(productId, ...fieldsToUpdate);

            res.status(201).json({ status: "success", payload: product });
        } else
            res.status(401).json({ status: "error", Message: "Id no valido" })
    } catch (error) {
        req.logger.error(`Error al actualizar producto: ${error}`);
        res.status(500).json({ status: "error", Message: "Error al actualizar" });
    }
}

export const deleteProducts = async (req, res) => {
    try {
        let productId = parseInt(req.params.pid);

        if (!isNaN(productId)) {
            let product = await productService.deleteProducts(productId);
            //SOCKET: 
            let allProducts = await productService.getProducts();
            let arrayProducts = allProducts.map(product => product._doc);
            io.emit("removeProducs", arrayProducts);

            res.status(200).json({ status: "success", payload: product });
        } else
            res.status(401).json({ status: "error", Message: "El id no es valido" });
    } catch (error) {
        req.logger.error(`Error al eliminar producto: ${error}`);
        res.status(500).json({ status: "error", Message: "Error al eliminar producto" });
    }
}

export const realtimeProducts = async (req, res) => {
    try {
        let title = "Prod. Actualizados";
        let allProducts = await productService.getProducts();
        let products = allProducts.map(product => product._doc);

        res.setHeader("Content-type", "text/html");
        res.status(200).render("realTimeProducts", { products, title });
    } catch (e) {
        req.logger.error("Error al obtener los productos: ", e);
        
        let error = "Error al obtener los productos"
        res.status(401).render("error", { error});
    }
}

