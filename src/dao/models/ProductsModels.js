import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
        title: String,
        description:  String,
        price: Number,
        owner: {
            type: String,
            unique: true    
        },
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
        stock: {
            type: Number,
            default: 0
        },
        status: String,
        category: String
        },
        {
            timestamps: true
        }
);

productsSchema.plugin(mongoosePaginate);

export default mongoose.model("productos", productsSchema);
