import express from "express";
export const router = express.Router();
import { insertCart, getCartById, getAllCarts, addProducInCart } from "../controller/cartsController.js";
import { passPortCall } from "../utils.js";
import { handleRol } from "../middleware/roleAccessHandler.js";

//Insertar un carrito:
router.post("/", passPortCall("current"), handleRol(["user"]), insertCart);

//Obtener todos los carritos:
router.get("/", passPortCall("current"), handleRol(["user"]), getAllCarts);

//Obtener un solo carrito: | :cid
router.get("/:id", passPortCall("current"), handleRol(["user"]), getCartById);

//Agregar un nuevo producto al carrito:
router.post("/addProduct", passPortCall("current"), handleRol(["user"]), addProducInCart);
