import cartsModel from "./models/CartsModels.js";

export class CartsDAO {
    constructor() { }

    insertCart = async () => {
        try {
            const cart = await cartsModel.create({ productos: [] });

            return { "success": true, "payload": cart.toJSON() };
        } catch (error) {
            console.log(`insertCarts: Error al crear el carrito: ${error}`);
            return { "success": false, "message": "Error al crear el carrito" };
        }
    };

    getCartById = async (idCart) => {
        try {
            const cart = await cartsModel.find({ "_id": idCart }).lean();

            if (cart)
                return { "success": true, "payload": cart };
            else
                return { "success": false, "message": "No se encontro el carrito" };
        } catch (error) {
            console.log(`Error al obtener los datos: ${error}`);
            return { error: "Carrito no encontrado." };
        }
    };

    getAllCarts = async () => {
        try {
            const Carts = await cartsModel.find();

            if (Carts)
                return { "success": true, "payload": Carts };
            else
                return { "success": false, "message": "Error" };
        } catch (error) {
            console.log(`Error al obtener los datos: ${error}`);
            return { error: "Carrito no encontrado." };
        }
    };

    addProducInCart = async (product) => {
        try {
            const cart = await cartsModel.find({ "_id": product.cartId });
            let prodId = parseInt(product.idProd);
            let flagProd = false;
            let _idProd

            for(let i=0; i < cart[0].productos.length; i++)
                if(cart[0].productos[i].idProd === prodId) {
                    _idProd = cart[0].productos[i]._id;
                    flagProd = true;
                    break;
                }

            if (!flagProd) {
                cart[0].productos.push({
                    title: product.title,
                    description: product.description,
                    category: product.category,
                    price: product.price,
                    cantidad: 1,
                    idProd: product.idProd
                });

                await cartsModel.updateOne({ _id: product.cartId }, { $set: cart[0] });
            } else {
                await cartsModel.findByIdAndUpdate(
                    product.cartId, 
                    { $inc: { "productos.$[product].cantidad": 1 } },
                    { arrayFilters: [{ "product._id": _idProd }] }
                );
            }

            return { Success: "Producto agregado correctamente!" }
        } catch (error) {
            console.log(`Error al agregar producto al carrito: ${error}`);
            return { Error: "Error al agregar producto al carrito" };
        }
    };

    //ActualiZar un carrito:
    upDateCart = async (id, valueUpDate) => {
        try {
            const _upDateCart = await cartsModel.updateOne({"_id": id}, {$set: valueUpDate});

            return _upDateCart;
        } catch (error) {
            console.log(`Error al actualizar producto: ${error}`);
            return {Error: "Error al actualizar producto"};
        }
    }
}


