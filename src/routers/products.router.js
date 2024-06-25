import express from "express";
export const router = express.Router();
import { getProductsAdmin, getProducts, insertProducs, getProductById, upDateProducts, deleteProducts } from "../controller/productsController.js";

import { passPortCall } from "../utils.js";
import handleRol from "../middleware/roleAccessHandler.js";

//##### MODELO VISTA CONTROLADOR ##### 
//Obtener todos los productos | Ejemplos: limit=5 -
router.get("/", passPortCall("current"), handleRol(["user"]), getProducts);

//router.get("/adminProducts", adminProducts);

//Lista de productos disponibles - Admin
router.get("/admin", passPortCall("current"), handleRol(["admin"]), getProductsAdmin);

//Insertar producto
router.post("/", passPortCall("current"), handleRol(["admin"]), insertProducs);

//Obtener un producto
router.get("/:pid", passPortCall("current"), handleRol(["admin"]), getProductById);

//Modificar un producto
router.put("/:pid", passPortCall("current"), handleRol(["admin"]), upDateProducts);

//Eliminar un producto
router.delete("/:pid", passPortCall("current"), handleRol(["admin"]), deleteProducts);