const fs = require("fs");
const path = require("path");

class ProductManagerdb {

    constructor(filePath) {
        this.objProduct = {
            title: "",
            description: "",
            price: "",
            thumbnail: "",
            code: "",
            stock: ""
        }
        this.path = path.join(__dirname, filePath)
        this.listProducts = [];
    }

    //get all
    getProducts = async () => {
        try {
            let rawProductList = JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }));
            return rawProductList;
        } catch (error) {
            console.log(`Error al obtener los datos: ${error}`);
            return {Error: "No se han encontrado productos"};
        }
    }
    //get by Id
    getProductById = async (id) => {
        try {
            let processedProductList = JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }));
            let product = await processedProductList.filter(product => product.id === id);

            return product;
        } catch (error) {
            console.log(`Error al obtener los datos: ${error}`);
            return {Error: "No se han encontrado productos"};
        }
    }
}

module.exports = ProductManagerdb;