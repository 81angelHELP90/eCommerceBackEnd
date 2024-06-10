import { ProductsDAO as productsDao } from "../dao/productsDao.js";

class ProductService {
    constructor(dao){
        this.dao = dao;
    }

    getProducts = async (limit, page, sort) => {
        return await this.dao.getProducts(limit, page, sort);
    };

    insertProducs = async (newProduct) => {
        return await this.dao.insertProducs(newProduct);
    };

    getProductById = async (productId) => {
        return await this.dao.getProductById(productId);
    };

    upDateProducts = async (productId, fieldsToUpdate) => {
        return await this.dao.upDateProducts(productId, fieldsToUpdate);
    }; 

    deleteProducts = async (productId) => {
        return await this.dao.deleteProducts(productId);
    }; 
}

export const productService = new ProductService(new productsDao);