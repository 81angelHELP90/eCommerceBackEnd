const fs = require("fs");
const path = require("path");

class ProductManager {

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

    //post product
    addProduct = async (newProduct) => {
        let validateData = await validations(newProduct, this.path);

        if (validateData.ok) {
            try {
                for (let i = 0; i < newProduct.length; i++) {
                    newProduct[i].id = Math.floor(Math.random() * (1000 - 1) + 1) //valor seudo-aleatorio entre 1 y 999
                    console.log(newProduct[i])
                    validateData.products.push(newProduct[i]);
                }

                await fs.promises.writeFile(this.path, await JSON.stringify(validateData.products, null, 3))
                console.log("Producto agregado correctamente!");
            } catch (error) {
                console.log(`Error al agregar producto: ${error}`);
                return;
            }
        } else
            console.log((validateData.property.includes("Error")) ? `${newProduct.title}: El codigo de producto ya existe!` : `${newProduct.title}: El campo ${validated.property} es obligatorio.`);
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
    //update product
    updateProduct = async (property) => {
        try {
            let processedProductList = JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }));
            let index = await processedProductList.findIndex(product => product.id === property.id);

            if (index !== -1) {
                await Object.entries(property.change[0])
                    .forEach(([key, value], i) => {
                        Object.keys(processedProductList[index]).forEach((productKey, j) => {
                            if (productKey === key)
                                processedProductList[index][key] = value;
                        });
                    });

                await fs.promises.writeFile(this.path, await JSON.stringify(processedProductList, null, 3));
                console.log("Producto actualizado correctamente");
            } else
                console.log("El producto a actualizar no se encuentra.");
        } catch (error) {
            console.log("Error al actualizar el producto");
        }
    }
    //delete product
    deleteProductBy = async (id) => {
        try {
            let processedProductList = JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }));
            let products = await processedProductList.filter(product => product.id === id);

            if (products.length > 0) {
                processedProductList = await processedProductList.filter(product => product.id !== id);

                await fs.promises.writeFile(this.path, await JSON.stringify(processedProductList, null, 3));
                console.log("Producto eliminado correctamente");
            } else
                console.log("El producto a eliminar no se encuentra.");
        } catch (error) {
            console.log(`Error al eliminar el producto: ${error}`);
        }
    }
}

//VALIDACIONES:
const validations = async (newProduct, path) => {
    if (fs.existsSync(path)) {
        let processedProductList = JSON.parse(await fs.promises.readFile(path, { encoding: "utf-8" }));

        for (let i = 0; i < newProduct.length; i++) {
            let keys = Object.keys(newProduct[i]);
            let values = Object.values(newProduct[i]);

            let uniqueCode = await processedProductList.findIndex(product => product.code === newProduct[i].code);

            if (uniqueCode !== -1)
                //return { ok: false, property: "Code Error", append: false };
                return { ok: false, property: "Code Error" };

            values.forEach((value, i) => {
                if (value === "")
                    //return { ok: false, property: keys[i], append: false };
                    return { ok: false, property: keys[i] };
            });
        }

        //return { ok: true, property: "", append: true, products: processedProductList };
        return { ok: true, property: "", products: processedProductList };
    } else
        //return { ok: true, property: "", append: false, products: [] };
        return { ok: true, property: "", products: [] };
}

//EJEMPLO EJECUCIÓN
/*
const Product = new ProductManager("./products.txt");

Product.addProduct([
    {
        title: "producto1",
        description: "producto 1 de la tienda",
        price: "55,90",
        thumbnail: "https://pathProduct1_img.svg",
        code: "767",
        stock: "35"
    },
    {
        title: "producto2",
        description: "producto 2 de la tienda",
        price: "75,90",
        thumbnail: "https://pathProduct1_img.svg",
        code: "124",
        stock: "34"
    },
    {
        title: "producto3",
        description: "producto 3 de la tienda",
        price: "44,90",
        thumbnail: "https://pathProduct3_img.svg",
        code: "267",
        stock: "343"
    }
])
*/
//OBTENER TODOS PRODUCTOS: Product.getProducts();

//OBTENER UN PRODUCTO: 5

//ACTUALIZAR UN PRODUCTO: Product.updateProduct({id:  211, change: [{title: "nuevo Producto 1", price: "199,99", description: "  nuevo Descripción producto 1"}]})

//BORRAR UN PRODUCTO: Product.deleteProductBy( 211);

module.exports = ProductManager;