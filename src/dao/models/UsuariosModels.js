import mongoose from "mongoose";

const usuariosSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    edad: Number,
    email:{
        type:String,
        unique: true
    },
    password: String,
    rol: {
        type: String,
        default: "user"
    },
    cart: {
        type: mongoose.Types.ObjectId, ref: "carts"
    }
})
 
 //1°Argumoento: nombre de la coleccíon | 2°Argumento: nombre del modelo
 export default mongoose.model("usuarios", usuariosSchema);