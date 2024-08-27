import mongoose from "mongoose";

const usuariosSchema = new mongoose.Schema(
    {
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
        },
        documents: {
            type: Array,
            default: [],
            require: false
        },
        status: {
            type: Boolean,
            default: false
        },
        last_connection: {
            type: Date,
            default: new Date,
            require: false
        },
    },
    {
        timestamps: true, strict: false
    }
)
 
export default mongoose.model("usuarios", usuariosSchema);