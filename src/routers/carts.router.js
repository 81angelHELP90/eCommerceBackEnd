import express from "express";
export const router = express.Router();
import { insertCart, getCartById, getAllCarts, addProducInCart } from "../controller/cartsController.js";

//##### MODELO VISTA CONTROLADOR ##### 
//Insertar un carrito:
router.post("/", insertCart);

//Obtener todos los carritos:
router.get("/", getAllCarts);

//Obtener un solo carrito:
router.get("/:cid", getCartById);

//Agregar un nuevo producto al carrito:
router.post("/addProduct", addProducInCart);
