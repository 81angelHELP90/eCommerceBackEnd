
const fs = require("fs");
const path = require("path");

class ValidationProductsHandler{
    //#objProduct; por objData
    #objData;
    //#path;
    #listProducts;

    constructor(objData, filePath){
        this.#objData = objData;
        this.path = path.join(__dirname, filePath);
    }

    #fieldExistValidation(){
        return (fs.existsSync(this.path));
    }

    async #getExistingProducts(){
        if(this.#fieldExistValidation()) 
            return  JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }));
        else
            return [];
    }

    async #existingCodeValidation(){ 
        this.#listProducts = await this.#getExistingProducts();

        if(this.#listProducts.length > 0)
            for (let i = 0; i < this.#objData.length; i++) {
                let uniqueCode = await this.#listProducts.findIndex(product => product.code === this.#objData[i].code);

                return uniqueCode !== -1;
            }
        else 
            return false;
    }

    async #emptyPropertyValidation(){ 
        let propertyOk = true;

        for (let i = 0; i < this.#objData.length; i++) {
            let values = Object.values(this.#objData[i]);

            values.forEach((value, i) => {
                if (value === "") {
                    propertyOk = false;
                    i = this.#objData.length;
                }
            });
        }

        return propertyOk;
    }

    async newProductValidation(){
        if(await this.#existingCodeValidation() === false)
            if(await this.#emptyPropertyValidation())
                return {error: false, listProducts: this.#listProducts}
            else
                return {error: true, message: "Todos los campos son obligatorios."}
        else
            return {error: true, message: "Codigo existente."}
    }
}

module.exports = ValidationProductsHandler;