import express from "express";
export const router = express.Router();
import { getMockProducts, getProductsAdmin, getProducts, insertProducs, getProductById, upDateProducts, deleteProducts } from "../controller/productsController.js";

import { passPortCall } from "../utils.js";
import { handleRol, handleCrudProdByRol } from "../middleware/roleAccessHandler.js";

//##### MODELO VISTA CONTROLADOR ##### 
//Obtener todos los productos | Ejemplos: limit=5 -
//router.get("/", passPortCall("current"), handleRol(["user"]), getProducts);
//5-08-24router.get("/", getProducts);
//Obtener Productos del SRV Mock:
router.get("/mockingproducts", passPortCall("current"), handleRol(["user"]), getMockProducts);

//router.get("/adminProducts", adminProducts);

//Lista de productos disponibles - Admin
router.get("/admin", passPortCall("current"), handleRol(["admin", "premium"]), getProductsAdmin);

//Insertar/Crear un producto al stock
router.post("/", passPortCall("current"), handleRol(["admin", "premium"]), insertProducs);

//Obtener un producto
router.get("/:pid", passPortCall("current"), handleRol(["admin", "premium"]), getProductById);

//Modificar un producto
router.put("/:pid", passPortCall("current"), handleRol(["admin", "premium"]), handleCrudProdByRol(), upDateProducts);

//Eliminar un producto
router.delete("/:id", passPortCall("current"), handleRol(["admin", "premium"]), handleCrudProdByRol(), deleteProducts); 