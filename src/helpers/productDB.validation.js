
import productsModel from "../dao/models/ProductsModels.js";

class ValidationProductsDBHandler{
    #objData;

    constructor(objData){
        this.#objData = objData;
    }

    async #existingCodeValidation(){ 
        const findProducts = await productsModel.find({code: this.#objData.code});
        
        return findProducts.length > 0;
    }

    async #emptyPropertyValidation(){ 
        let completeProperties = true;
        let values = Object.values(this.#objData);

        for (let i = 0; i < values.length; i++) {
            if(values[i] === "thumbnail" && values[i].length === 0){
                completeProperties = false;
                break;
            }

            if(values[i] !== "thumbnail" && values[i] === ""){
                completeProperties = false;
                break;
            }
        }

        return completeProperties;
    }

    async newProductValidation(){
        let validateCode = await this.#existingCodeValidation();

        if(!validateCode){
            let completeProperties = await this.#emptyPropertyValidation();

            return completeProperties ? {status: "success", message: "Validaciones ok."} : {status: "Error", message: "Todos los campos son obligatorios."}
        } else
            return {status: "Error", message: "Codigo existente."}
    }
}

export default ValidationProductsDBHandler;
