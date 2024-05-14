//const mongoose = require("mongoose");
import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
    id:{
        type: Number,
        required: true, 
        unique: true    
    },
    products: {
        type: Array
        /* 
        product: {
            type: Number
        },
        quantity: {
            type: Number
        }
        */
    },
})
 
 //1°Argumoento: nombre de la coleccíon | 2°Argumento:; nombre del modelo
 export default mongoose.model("carts", cartsSchema);
