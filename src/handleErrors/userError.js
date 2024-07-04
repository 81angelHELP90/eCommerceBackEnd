import os from "os";

export function checkArgumentos(userData){
    let { email, password, ...otros } = userData;
    
        return `Los datos email y password son obligatorios:\n EMAIL => Se recibió: ${email} | PASSWORD => Se recibió: ${password}
            Fecha: ${new Date().toUTCString()}
            Usuario: ${os.userInfo().username}
            Terminal: ${os.hostname()}`
}

export function checkUser(){

    return `No se encontro usuario válido.
            Fecha: ${new Date().toUTCString()}
            Usuario: ${os.userInfo().username}
            Terminal: ${os.hostname()}`

}