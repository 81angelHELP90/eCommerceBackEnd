
const mongoDb = require("mongoose");
const productsSchema = new mongoDb.Schema({
        title: String,
        description:  String,
        price:  String,
        thumbnail:{
            type: Array
        },
        code:{
            type: String,
            required: true, 
            unique: true    
        },
        id:{
            type: Number,
            required: true, 
            unique: true    
        },
        stock:  String,
        status: String,
        category: String
    }
)

//1°Argumoento: nombre de la coleccíon | 2°Argumento:; nombre del modelo
module.exports = mongoDb.model("productos", productsSchema);