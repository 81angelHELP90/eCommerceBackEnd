import fs from "fs";
import path from "path";
import __dirname from "../utils.js"

export default class ValidationCartsHandler{
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