class ProductManager{

    constructor(){
        this.objProduct = {
            title: "",
            description: "",
            price: "",
            thumbnail: "",
            code: "",
            stock: ""
        }

        this.listProducts = [];
    }

    addProduct(newProduct){
        let validated = validations(newProduct, this.listProducts)

        if(validated.ok){
            newProduct.id = Math.floor(Math.random() * (1000 - 1) + 1) //valor seudo-aleatorio entre 1 y 999
            this.listProducts.push(newProduct);
            console.log(`${newProduct.title}: producto agregado`);
        } else 
            console.log((validated.property.includes("Error")) ? `${newProduct.title}: El codigo de producto ya existe!` : `${newProduct.title}: El campo ${validated.property} es obligatorio.`);
    }

    getProducts(){
        return this.listProducts;
    }

    getProductById(code){
        let productFound = this.listProducts.filter(product => product.code === code);

        if(this.listProducts.length === 0 || productFound.length === 0)
            return "Not found"
        else 
            return productFound;
    } 
}

//VALIDACIONES:
const validations = (newProduct, listProducts) => {
    let keys = Object.keys(newProduct);
    let values = Object.values(newProduct);
    let validated = {ok: true, property: ""};
    let uniqueCode = listProducts.findIndex(product => product.code === newProduct.code);

    if(uniqueCode !== -1)
        return {ok: false, property: "Code Error"};

    values.forEach((value, i) => {
        if(value === "")
            validated = {ok: false, property: keys[i]};
    });

    return validated;
}

/*EJEMPLO EJECUCIÓN
const Product1 = new ProductManager();
const Product2 = new ProductManager();

Product1.addProduct({
    title: "producto1",
    description: "producto 1 de la tienda",
    price: "55,90",
    thumbnail: "https://pathProduct1_img.svg",
    "code": "123",
    "stock": "30"
})

Product2.addProduct({
    title: "producto2",
    description: "producto 2 de la tienda",
    price: "75,90",
    thumbnail: "https://pathProduct1_img.svg",
    "code": "124",
    "stock": "34"
})

//OBTENER TODOS PRODUCTOS:
//console.log(Product1.getProducts());

//OBTENER UN PRODUCTO:
//console.log(Product1.getProductById(235));
*/
