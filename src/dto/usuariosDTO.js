export class UsuariosDTO {
    constructor(user){
        this.nombre = user.nombre;
        this.email = user.email;
        this.rol = user.rol;
    }
}