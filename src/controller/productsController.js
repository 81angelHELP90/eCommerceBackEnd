import { productService } from "../services/productsService.js";
import io from "../app.js";
import { generateProducs } from "../utils.js"
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { CustomError } from "../handleErrors/customError.js";
import { TIPOS_ERROR } from "../handleErrors/EErrors.js";
import { insertNewProductError } from "../handleErrors/productsError.js";

//mock
export const getMockProducts = async (req, res) => {
    try {
        let products = await generateProducs();

        res.status(201).json({ status: "success", payload: products });
    } catch (e) {
        req.logger.error(`Error al obtener los productos: ${e}`);
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
        if(req.user && req.headers.referer && !req.headers.referer.includes("apiDocs")) {
            let cart = { _id: req.user.cart }

            res.setHeader('Content-type','text/html');
            res.status(201).render("products", { products, title,  cart});
        } else 
            res.status(201).json({ status: "success", payload: products });
    } catch (e) {
        let error = "Error al obtener los productos"

        req.logger.error(`${error}: ${e}`);
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
        if(req.user && req.headers.referer && !req.headers.referer.includes("apiDocs")) {
            res.setHeader('Content-type','text/html');
            res.status(201).render("productsAdmin", { products});
        } else 
            res.status(201).json({ status: "success", payload: products });
    } catch (e) {
        let error = "Error al obtener los productos"

        req.logger.error(`${error}: ${e}`);
        res.status(401).render("error", {error});
    }
}

//Insertar/Crear un nuevo producto en el stock
export const insertProducs = async (req, res) => {
    try { 
        const newProduct = req.body;
        const rolUser = req.user.rol;
        const email = req.user.email;

        if(!newProduct.title || !newProduct.price) {
            req.logger.info("Faltan datos");
            CustomError.createError("Faltan datos", {newProduct}, insertNewProductError(req.body), TIPOS_ERROR.ARGUMENTOS_INVALIDOS);
        } else {
            newProduct.owner = rolUser === "premium" ? email : rolUser;

            let insertedProduct = await productService.insertProducs(newProduct);
        
            if(insertedProduct.status === "success") {
                //SOCKET: 
                let allProducts = await productService.getProducts();
                let arrayProducts = allProducts.map(product => product._doc);
                
                io.emit("addProducs", arrayProducts);
                res.status(201).json({ status: "success", payload: insertedProduct.payload });
            } else {
                req.logger.error(`Error al agregar producto: ${insertedProduct.message}`);
                res.status(401).json({ status: "error", message: insertedProduct.message });
            }
        }
    } catch (e) {
        req.logger.error(`Error al agregar producto: ${e}`);
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

//Modificar un producto del stock
export const upDateProducts = async (req, res) => {
    try {
        const updateId = req.params.pid;
        const fieldsToUpdate = req.body;
        const arrayFieldsToUpdate = [];
        let productId = parseInt(updateId);

        arrayFieldsToUpdate.push(fieldsToUpdate);

        if (!isNaN(productId)) {
            let product = await productService.upDateProducts(productId, ...arrayFieldsToUpdate);

            res.status(201).json({ status: "success", payload: product });
        } else
            res.status(401).json({ status: "error", Message: "Id no valido" })
    } catch (e) {
        req.logger.error(`Error al actualizar producto: ${e}`);
        res.status(500).json({ status: "error", Message: "Error al actualizar" });
    }
}

//Eliminar un producto del stock
export const deleteProducts = async (req, res) => {
    try {
        const productId = parseInt(req.params.id)//ORIGINAL parseInt(req.params.pid);
        
        if (!isNaN(productId)) {

            let message = await productService.deleteProducts(productId);
            
            //SOCKET: 
            let allProducts = await productService.getProducts();
            let arrayProducts = allProducts.map(product => product._doc);
            io.emit("removeProducs", arrayProducts);

            res.status(200).json({ status: "success", payload: message });
        } else
            res.status(401).json({ status: "error", Message: "El id no es valido" });
    } catch (e) {
        req.logger.error(`Error al eliminar producto: ${e}`);
        res.status(500).json({ status: "error", Message: "Error al eliminar producto" });
    }
}

export const realtimeProducts = async (req, res) => {
    try {
        let title = "Prod. Actualizados";
        let allProducts = await productService.getProducts();
        let products = allProducts.map(product => product._doc);

        res.setHeader("Content-type", "text/html");
        res.status(201).render("realTimeProducts", { products, title });
    } catch (e) {
        let error = "Error al obtener los productos"

        req.logger.error(`${error}: ${e}`);
        res.status(401).render("error", { error});
    }
}

