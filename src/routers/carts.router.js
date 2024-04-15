import express from "express";
import fs from "fs";
import ValidationCartsHandler from "../helpers/cart.validation.js";
import CartManager from "../cartsManagerHelper.js";

const cartValidations = new ValidationCartsHandler("../carts.json");
const Cart = new CartManager("./carts.json");
export const router = express.Router();

//Endpoints
router.post("/", async (req, res) => {
    try {
        let cartList = await cartValidations.newCartValidation();

        cartList.push({ id: Math.floor(Math.random() * (1000 - 1) + 1), products: [] });

        await fs.promises.writeFile(Cart.path, await JSON.stringify(cartList, null, 3))
        res.status(200).json({ success: true, message: "Carrito creado correctamente!" })
    } catch (error) {
        res.status(400).json({ error: true, message: "Error al agregar el carrito." });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        let idCart = parseInt(req.params.cid);

        if (!isNaN(idCart)) {
            let cart = await Cart.getCartById(idCart);
            (cart.error) ? res.status(500).json({ error: true, message: cart.error }) : res.status(200).json({ success: true, carts: cart });
        } else
            res.status(500).json({ error: true, Message: "Carrito no encontrado" });
    } catch (error) {
        res.status(500).json({ error: true, Message: "Carrito no encontrado" });
    }
});

router.post("/:cid/products/:pid", async (req, res) => {
    let { cid, pid } = req.params;

    try {
        let idCart = parseInt(cid);
        let idProduct = parseInt(pid);

        if (!isNaN(idCart)) {
            if (!isNaN(idProduct)) {
                let carts = await Cart.getAllCarts();
                let indexCart =  carts.findIndex(cart => cart.id === idCart);

                if(indexCart !== -1) {
                    let index = carts[indexCart].products.findIndex(product => (product) ? product.product === idProduct : -1);

                    (index === -1) ? carts[indexCart].products.push({product: idProduct, quantity: 1}) : carts[indexCart].products[index].quantity += 1;

                    await fs.promises.writeFile(Cart.path, await JSON.stringify(carts, null, 3));

                    res.status(200).json({ success: true, message: "Producto agregado correctamente!" })
                } else
                    res.status(500).json({ error: true, Message: "El carrito no existe" });
            } else 
                res.status(500).json({ error: true, Message: "El id del producto no es valido" });
        } else 
            res.status(500).json({ error: true, Message: "El id del carrito no es valido" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, Message: "Error al agregar el producto." });
    }

});
