import { TIPOS_ERROR } from "./EErrors.js";

export class CustomError {
    static createError(name="Error", cause, message, code=TIPOS_ERROR.INTERNAL_SERVER_ERRO){
        const error = new Error(message, {cause})
        
        error.name = name;
        error.code = code;

        throw error;
    }
}