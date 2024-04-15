/*13-04-2024
const fs = require("fs");
const path = require("path");
*/

import fs from "fs";
import path from "path";
import __dirname from "./utils.js"

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

export default CartManager;
//module.exports = CartManager;