
const mongoDb = require("mongoose");

const productsSchema = new mongoDb.Schema(
    {
        title:{
            type: String
        },
        description:{
            type: String
        },
        price:{
            type: String
        },
        thumbnail:{
            type: Array
        },
        code:{
            type: String,
            required: true, 
            unique: true    
        },
        stock:{
            type: String
        },
        status:{
            type: Boolean
        },
        category:{
            type: String
        },
        id:{
            type: Number,
            required: true,
            unique: true,     
        }
    }
)

//1°Argumoento: nombre de la coleccíon | 2°Argumento:; nombre del modelo
module.exports = mongoDb.model("productos", productsSchema);