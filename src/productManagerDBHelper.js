const validationProductsHandlerdb = require("./helpers/productDB.validation.js");
const productsModel = require("./dao/models/ProductsModels.js");

class ProductManagerdb {

    constructor() {
        this.objProduct = {
            title: "",
            description: "",
            price: "",
            thumbnail: "",
            code: "",
            stock: ""
        }
    }

    getProducts = async (limit) => {
        try {
            const listProducts = await productsModel.find().limit(parseInt(limit)).lean();
            return listProducts;
        } catch (error) {
            console.log(`Error al obtener los datos: ${error}`);
            return {"status": "Error", "message": "Error al obtener los productos"}; 
        }
    }
    
    getProductById = async (id) => {
        try {
            const product = await productsModel.find({id: id});
            return product;
        } catch (error) {
            console.log(`Error al obtener los datos: ${error}`);
            return {Error: "No se han encontrado productos"};
        }
    }

    insertProducs = async (newProduct) => {
        try {
            const productValidations = new validationProductsHandlerdb(newProduct);
            let validation = await productValidations.newProductValidation(newProduct);

            if (validation.status === "success") {
                newProduct.id = Math.floor(Math.random() * (1000 - 1) + 1);
                const product = await productsModel.create(newProduct);
                return {"status": validation.status, "payload": product};
            } else 
                return {"status": validation.status, "message": validation.message}; 
        } catch (error) {
            console.log(`insertProducs: Error al agregar producto: ${error}`);
            return {"status": "Error", "message": "Error al agregar producto"}; 
        }
    }

    upDateProducts = async (id, valueUpDate) => {
        try {
            const upDateProduct = await productsModel.updateOne({id: id}, {$set: valueUpDate});

            if(upDateProduct.modifiedCount > 0){
                let product = await productsModel.find({id: id});
                return product;  
            } else 
                upDateProduct
        } catch (error) {
            console.log(`Error al actualizar producto: ${error}`);
            return {Error: "Error al actualizar producto"};
        }
    }

    deleteProducts = async (id) => {
        try {
            const deleteProd = await productsModel.deleteOne({id: id});

            if(deleteProd.deletedCount > 0)
                return deleteProd;
            else
                return "No se encotro el producto a elimiar";
        } catch (error) {
            console.log(`Error al elimiar producto: ${error}`);
            return {Error: "Error al elimiar producto"};
        }
    }
}

module.exports = ProductManagerdb;