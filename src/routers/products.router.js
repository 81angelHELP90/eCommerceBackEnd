import express from "express";
export const router = express.Router();
import { getProducts, insertProducs, getProductById, upDateProducts, deleteProducts } from "../controller/productsController.js";

//##### MODELO VISTA CONTROLADOR ##### 
//Obtener todos los productos | Ejemplos: limit=5 -
router.get("/", getProducts);

//Insertar producto
router.post("/", insertProducs);

//Obtener un producto
router.get("/:pid", getProductById);

//Modificar un producto
router.put("/:pid", upDateProducts);

//Eliminar un producto
router.delete("/:pid", deleteProducts);