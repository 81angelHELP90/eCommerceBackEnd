
const fs = require("fs");
const path = require("path");

class CartManager{
    constructor(filePath){
        this.path = path.join(__dirname, filePath);
    }

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
}

module.exports = CartManager;