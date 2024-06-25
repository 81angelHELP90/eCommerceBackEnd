import { productService } from "../services/productsService.js";

class Helper {
    constructor() { }

    calTotalCart(productsPurchase, productsCart) {
        let total = 0;

        try {
            productsCart.forEach((product, i) => {
                if(productsPurchase[i]?.stockDisponible === "true")
                    total += product.cantidad * product.price;
            });

            return total.toFixed(2);
        } catch (error) {
            console.log("Error al calcular el total: ", error);
            return total;
        }
    }

    checkAvailableStock = (cartProducts) => {
        try {
            return cartProducts.map(product => {
                //Obtengo producto
                let productId = parseInt(product.idProd);

                if(!isNaN(productId)) {
                    productService.getProductById(productId)
                        .then(data => {
                            product.stockDisponible = (parseInt(data[0].stock) - product.cantidad) >= 0;

                            console.log("product: ", product);
                        })
                        .catch(e => {
                            console.log("map error: ", e);
                    });
                }
            });
        } catch (error) {
            console.log("Error al corroborar stock: ", error);
        }
   }

   buildDataPurchase = (purchaseData) => {
        try {
            return {
                code: Math.floor(Math.random() * (1000 - 1) + 1),
                purchase_datetime: new Date(),
                amount: parseFloat(purchaseData.amount),
                purchaser: purchaseData.purchaser
            }
        } catch (error) {
            console.log("Error buildDataPurchase: ", error);
        }
   }
}

export const helper = new Helper();

