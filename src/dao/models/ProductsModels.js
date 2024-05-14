import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
        title: String,
        description:  String,
        price: Number,
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
);

productsSchema.plugin(mongoosePaginate);

//1°Argumoento: nombre de la coleccíon | 2°Argumento:; nombre del modelo
export default mongoose.model("productos", productsSchema);
