import { CartsDAO as cartsDao } from "../dao/cartsDao.js";

class CartService {
    constructor(dao){
        this.dao = dao;
    }

    insertCart = async () => {
        return await this.dao.insertCart();
    };

    getCartById = async (idCart) => {
        return await this.dao.getCartById(idCart);
    };

    getAllCarts = async () => { 
        return await this.dao.getAllCarts();
    };

    addProducInCart = async (product) => {
        return await this.dao.addProducInCart(product);
    };

    upDateCart = async (id, valueUpDate) => {
        return await this.dao.upDateCart(id, valueUpDate);
    };
}

export const cartService = new CartService(new cartsDao);