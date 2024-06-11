import { cartService } from "../services/cartsService.js";

export const insertCart = async (req, res) => {
    try {
        let insertedCart = await cartService.insertCart();

        if (insertedCart.success)
            res.status(201).json({ status: "success", payload: "Carrito creado correctamente !!!" });
        else
            res.status(501).json({ status: "Error", Message: "Error al intentar guardar" });
    } catch (error) {
        console.log(`Error al agregar producto: ${error}`);
        res.status(401).json({ status: "error", message: "Error al intentar guardar" });
    }
};

export const getCartById = async (req, res) => {
    try {
        let { cid } = req.params;
        let Cart = await cartService.getCartById(cid);

        Cart.success ? res.status(201).json({ status: "success", "payload": Cart.payload }) : res.status(501).json({ status: "Error", Message: Cart.error });
    
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: true, Message: "Error al obtener el carrito." });
    }
};

export const getAllCarts = async (req, res) => {
    try {
        let Carts = await cartService.getAllCarts();
        Carts.success ? res.status(201).json({ status: "success", Carts }) : res.status(501).json({ status: "Error", Message: Carts.message});
    
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: true, Message: "Error al obtener los carritos." });
    }
};

export const addProducInCart = async (req, res) => {
    const newProduct = req.body;

    let addProduct = await cartService.addProducInCart(newProduct);

    if(addProduct.Success)
        res.status(201).json({ status: "success", Message: addProduct.Success });
    else
        res.status(501).json({ status: "error", Message: addProduct.Error });
}