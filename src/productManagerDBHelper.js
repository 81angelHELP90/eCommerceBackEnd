import validationProductsHandlerdb from "./helpers/productDB.validation.js";
import productsModel from "./dao/models/ProductsModels.js";

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

    getProducts = async (limit, page, sort) => {
        try {
            let _limit = isNaN(parseInt(limit)) ? 10 : parseInt(limit);
            let _page = isNaN(parseInt(page)) ? 1 : parseInt(page);
            let querySort =  (sort) ? parseInt(sort.split(":")[1]) : null;

            //const listProducts = await productsModel.find().limit(parseInt(_limit)).lean();
            //const listProducts = await productsModel.paginate({}, {limit: _limit, page: _page}).sort({ id: -1 }); //querySort;
            const listProducts = (querySort) ? await productsModel.find().limit(parseInt(_limit)).sort({ price: querySort }).lean() : await productsModel.find().limit(parseInt(_limit));

            return listProducts;
        } catch (error) {
            console.log(`Error al obtener los datos: ${error}`);
            return {"status": "Error", "message": "Error al obtener los productos"}; 
        }
    }
    
    getProductById = async (id) => {
        try {
            const product = await productsModel.find({id: id}).lean();
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

export default ProductManagerdb;
