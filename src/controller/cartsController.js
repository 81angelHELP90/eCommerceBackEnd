import { cartService } from "../services/cartsService.js";
import { helper } from "../helpers/helpers.js";
import { ticketService } from "../services/ticketService.js"

import { productService } from "../services/productsService.js";

export const insertCart = async (req, res) => {
    try {
        let insertedCart = await cartService.insertCart();

        if (insertedCart.success)
            res.status(201).json({ status: "success", payload: "Carrito creado correctamente !!!" });
        else
            res.status(501).json({ status: "Error", Message: "Error al intentar guardar" });
    } catch (error) {
        req.logger.error(`Error al agregar producto: ${error}`);
        res.status(401).json({ status: "error", message: "Error al intentar guardar" });
    }
};

export const getCartById = async (req, res) => {
    try {
        let cid = req.params.id;
        let Cart = await cartService.getCartById(cid);
        let products = Cart.payload[0]?.productos;
        let error = Cart.error;

        if(req.user && req.headers.referer && !req.headers.referer.includes("apiDocs")) {
            
            res.setHeader('Content-type','text/html');
            Cart.success && (req.user.cart === cid) ? res.status(201).render("cart", { cid, products }) : res.status(401).render("error", { error });
        } else 
            Cart.success && (req.user.cart === cid) ? res.status(201).json({ status: "success", payload: products }) : res.status(501).json({ status: "Error", Message: error });
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: true, Message: "Error al obtener el carrito." });
    }
};

export const finallyPurchase = async (req, res) => {
    try {
        let cid = req.params.id;
        let cart = await cartService.getCartById(cid);
        let products = cart.payload[0]?.productos;
        
        //Check Stock:
        if(products.length > 0) {
            for (let i = 0; i < products.length; i++) {
                let productId = parseInt(products[i].idProd);

                productService.getProductById(productId)
                    .then(data => {
                        if(data.length > 0) {
                            products[i].stockDisponible = parseInt(data[0].stock) - products[i].cantidad >= 0;
                            products[i].stockRestante = parseInt(data[0].stock) - products[i].cantidad;
                            let empty = false;

                            if((products.length - 1) === i) {
                                if(cart.success)
                                    req.headers.referer && !req.headers.referer.includes("apiDocs") ? res.status(201).render("purchase", { cid, products, empty}) : res.status(201).json({ status: "success", payload: products });
                                else {
                                    let error = Cart.error
                                    req.headers.referer && !req.headers.referer.includes("apiDocs") ? res.status(401).render("error", { error }) : res.status(501).json({ status: "Error", Message: error });
                                }
                            }
                        } 
                    })
                    .catch(e => {
                        req.logger.error("map error: ", e);
                    });
            }
        } else {
            let empty = true;
            req.headers.referer && !req.headers.referer.includes("apiDocs") ? res.status(201).render("purchase", { cid, products, empty}) : res.status(201).json({ status: "Error", Message: "No hay producos en el carrito" });
        };
    } catch (error) {
        req.logger.error(error)
        res.status(401).json({ error: true, Message: "Error al finalizar la compra." });
    }
};

export const setTicket = async (req, res) => {
    let cid = req.body.cartObj.cartID;
    let productsPurchase = req.body.cartObj.dataProducts;
    let purchaser = req.user.email;
    let cart = await cartService.getCartById(cid);
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
                        
                        cartService.upDateCart(cid, {productos: []})
                            .then(data => {
                                //Creo y envio el ticket:
                                ticketService.insertTicket(purchaseInfo)
                                    .then(ticket => {
                                        //console.log("success _ticket: ", ticket);
                                        res.status(201).json({ status: "success", Payload: ticket});
                                    })
                                    .catch(e => {
                                        req.logger.error("ticketService error: ", e);
                                    });
                            })
                            .catch(e => {
                                req.logger.error("cartService error: ", e);
                            });
                    }
                })
                .catch(e => {
                    req.logger.error("productService error: ", e);
                });
        }
    
    });
}

export const getAllCarts = async (req, res) => {
    try {
        let Carts = await cartService.getAllCarts();
        Carts.success ? res.status(201).json({ status: "success", Carts }) : res.status(501).json({ status: "Error", Message: Carts.message});
    
    } catch (error) {
        req.logger.error(error)
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