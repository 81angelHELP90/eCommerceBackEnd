import os from "os";

export function checkArgumentos(userData){
    let { email, password, ...otros } = userData;
    let _email = (email) ? email : "vacio";
    let _password = (password) ? password : "vacio";

        return `Los datos email y password son obligatorios:\n EMAIL => Se recibió: ${_email} | PASSWORD => Se recibió: ${_password}
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