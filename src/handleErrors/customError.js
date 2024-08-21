import { TIPOS_ERROR } from "./EErrors.js";

export class CustomError {
    static createError(name="Error", cause, message, code=TIPOS_ERROR.INTERNAL_SERVER_ERRO){
        const error = new Error(message, {cause})
        
        error.name = name;
        error.code = code;
        error.stack = ""; //hago esto porque sino me impreme un "choclo" de info en la consola

        throw error;
    }
}