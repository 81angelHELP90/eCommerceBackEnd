import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
    /*
    id:{
        type: Number,
        required: true, 
        unique: true    
    },
    */
    productos: {
        type: [{
            product: {type: mongoose.Types.ObjectId, ref: "productos"},
            cantidad: Number
        }]
    },
})
 
 //1°Argumoento: nombre de la coleccíon | 2°Argumento:; nombre del modelo
 export default mongoose.model("carts", cartsSchema);
