import { cartService } from "../services/cartsService.js";
import { helper } from "../helpers/helpers.js";
import { ticketService } from "../services/ticketService.js"
//import { cartsDTO } from "../dto/cartsDTO.js";

import { productService } from "../services/productsService.js";

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
//Creo que ya no sería necesario. Se utiliZa finallyPurchase
export const getCartById = async (req, res) => {
    try {
        let cid = req.params.id;
        let Cart = await cartService.getCartById(cid);
        let products = Cart.payload[0]?.productos;
        
        Cart.success ? res.status(200).render("cart", { cid, products }) : res.status(501).json({ status: "Error", Message: Cart.error });
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: true, Message: "Error al obtener el carrito." });
    }
};

export const finallyPurchase = async (req, res) => {
    try {
        let cid = req.params.id;
        let cart = await cartService.getCartById(cid);
        //Productos del carrito:
        let products = cart.payload[0]?.productos; 
        
        //Check Stock:
        if(products.length > 0) {
            for (let i = 0; i < products.length; i++) {
                //Obtengo producto de la base: 
                let productId = parseInt(products[i].idProd);

                productService.getProductById(productId)
                    .then(data => {
                        products[i].stockDisponible = parseInt(data[0].stock) - products[i].cantidad >= 0;
                        products[i].stockRestante = parseInt(data[0].stock) - products[i].cantidad;
                        let empty = false;
                        if((products.length - 1) === i)
                            cart.success ? res.status(200).render("purchase", { cid, products, empty}) : res.status(501).json({ status: "Error", Message: Cart.error });
                    })
                    .catch(e => {
                        console.log("map error: ", e);
                    });
            }
        } else {
            let empty = true;
            res.status(200).render("purchase", { cid, products, empty})
        };
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: true, Message: "Error al finalizar la compra." });
    }
};

export const setTicket = async (req, res) => {
    let cid = req.body.cartObj.cartID;
    let productsPurchase = req.body.cartObj.dataProducts;
    let purchaser = req.user.email;
    let cart = await cartService.getCartById(cid);
    //Productos del carrito
    let productsCart = cart.payload[0]?.productos;

    //Actualio el stock de cada producto
    let upDateProd = productsCart.map((product, i) => {
        if(productsPurchase[i].stockDisponible === "true" && product.idProd == productsPurchase[i].idProd) {
            product.cantidad = parseInt(productsPurchase[i].stockRestante);
            
            productService.upDateProducts(product.idProd, {stock: product.cantidad})
                .then(data => {
                    if((productsCart.length - 1) === i){
                        let amount = helper.calTotalCart(productsPurchase, productsCart);
                        let purchaseInfo = helper.buildDataPurchase({amount, purchaser});
                        
                        //Actulio carrito: ESTO CUANDO TODOS LOS PRODUCTOS DEL CARRITO SE PUDIERON PROCESAR:
                        //ME FALTARIA LA PARTE DONDE FALLA (por falta de stock, por ejemplo) ALGUN PRODUCTO
                        cartService.upDateCart(cid, {productos: []})
                            .then(data => {
                                //Creo y envio el ticket:
                                ticketService.insertTicket(purchaseInfo)
                                    .then(ticket => {
                                        //console.log("success _ticket: ", ticket);
                                        res.status(201).json({ status: "success", Payload: ticket});
                                    })
                                    .catch(e => {
                                        console.log("ticketService error: ", e);
                                    });
                            })
                            .catch(e => {
                                console.log("cartService error: ", e);
                            });
                    }
                })
                .catch(e => {
                    console.log("productService error: ", e);
                });
        }
    
    });
}

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