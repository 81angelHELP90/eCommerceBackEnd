import os from "os";

export function getCartsError(){
    return `Error al recuperar los productos.
            Fecha: ${new Date().toUTCString()}
            Usuario: ${os.userInfo().username}
            Terminal: ${os.hostname()}`

}

export function insertNewProductError(newProduct){
    let { title, price, ...otros } = newProduct;
    
        return `\nPara poder agregar un producto al stock el titulo y el precio del mismo son obligatorios: 
            TITLE => Se recibió: ${title} | PRICE => Se recibió: ${price}
            Fecha: ${new Date().toUTCString()}
            Usuario: ${os.userInfo().username}
            Terminal: ${os.hostname()}`
}