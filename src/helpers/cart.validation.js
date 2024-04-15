const fs = require("fs");
const path = require("path");

class ValidationCartsHandler{
    #listCarts = [];

    constructor(filePath){
        this.path = path.join(__dirname, filePath);
    }

    #fieldExistValidation(){
        return (fs.existsSync(this.path));
    }

    async newCartValidation(){
        if(this.#fieldExistValidation()) 
            return  JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }));
        else
            return this.#listCarts;
    }
}

module.exports = ValidationCartsHandler;