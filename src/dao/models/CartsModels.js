const mongoDb = require("mongoose");
const cartsSchema = new mongoDb.Schema({
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
 module.exports = mongoDb.model("carts", cartsSchema);