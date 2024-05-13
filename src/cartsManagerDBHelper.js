const validationCartsHandlerdb = require("./helpers/cartDB.validation.js");
const cartsModel = require("./dao/models/CartsModels.js");
const validationCarts = new validationCartsHandlerdb();

class CartManager{
    #handleDBResponse(dbResponse){
        let status = (dbResponse.modifiedCount > 0) ? 
            {"success": true, "payload": "Producto agregado."} : 
            {"success": false, "payload": "Error al agregar el producto."};
        
            return status;
    }

    insertCart = async () => {
        try {
            const newCart = { id: Math.floor(Math.random() * (1000 - 1) + 1), products: [] };
            const cart = await cartsModel.create(newCart);

            return {"success": true, "payload": cart};
        } catch (error) {
            console.log(`insertCarts: Error al crear el carrito: ${error}`);
            return {"success": false, "message": "Error al crear el carrito"}; 
        }
    }

    insertProductsInCart = async (idCart, idProd) => {
        try {
        //NOTA: NO SE COMO HACER PARA QUE DENTRO DE ESE DONCUMENTO ME TRAIGA SOLO EL PRODUCTO QUE COINCIDA CON idProd
            //const cart = await cartsModel.findOne({"id": idCart, "products": {$elemMatch: { "product": idProd }}});
            const cart = await cartsModel.find({ "id": idCart });

            if(cart){
                let index = cart[0].products.findIndex(product => product.product === idProd);

                if(index !== -1) {
                    cart[0].products[index].quantity += 1;
                    
                    const upDateCart = await cartsModel.updateOne({id: idCart}, {$set: cart[0]});
                
                    return this.#handleDBResponse(upDateCart);
                } else {
                    cart[0].products.push({ quantity: 1, product: idProd }); 
                    const upDateCart = await cartsModel.updateOne({id: idCart}, {$set: cart[0]});

                    return this.#handleDBResponse(upDateCart);
                }
            } else
                return {"success": false, "message": "No se encontro el carrito"}; 
        } catch (error) {
            console.log(`insertProductsInCart: Error al insertar productos en el carrito: ${error}`);
            return {"success": false, "message": "Error al insertar productos en el carrito"}; 
        }
    }

    getCartById = async (idCart) => {
        try {
            const cart = await cartsModel.find({ "id": idCart });

            if(cart)
                return {"success": true, "payload": cart}; 
            else
                return {"success": false, "message": "No se encontro el carrito"}; 
        } catch (error) {
            //console.log(`Error al obtener los datos: ${error}`);
            return {error: "Carrito no encontrado."};
        }
    }

    getAllCarts = async () => {
        try {
            const Carts = await cartsModel.find();

            if(Carts)
                return {"success": true, "payload": Carts}; 
            else
                return {"success": false, "message": "Error"}; 
        } catch (error) {
            //console.log(`Error al obtener los datos: ${error}`);
            return {error: "Carrito no encontrado."};
        }
    }

    /*
    getCartById = async (id) => {
        try {
            let processedCartsList = JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }));
            return await processedCartsList.filter(cart => cart.id === id);;
        } catch (error) {
            //console.log(`Error al obtener los datos: ${error}`);
            return {error: "Carrito no encontrado."};
        }
    }
    
    getAllCarts = async () => {
        try {
            return await JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }));
        } catch (error) {
            return {error: "Error al obterner los carritos"};
        }
    }
    */
}

module.exports = CartManager;