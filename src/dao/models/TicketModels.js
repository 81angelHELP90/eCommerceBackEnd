import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ticketSchema = new mongoose.Schema({
        code:{
            type: String,
            required: true, 
            unique: true    
        },
        purchase_datetime: {
            type: Date,
            unique: true
        },
        amount: Number,
        purchaser:{
            type:String,
            unique: true
        },
    },
    {
        timestamps: true
    }
);

ticketSchema.plugin(mongoosePaginate);

export default mongoose.model("ticket", ticketSchema);