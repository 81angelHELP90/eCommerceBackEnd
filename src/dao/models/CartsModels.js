import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
    productos: {
        type: [{
            product: {type: mongoose.Types.ObjectId, ref: "productos"},
            cantidad: Number,
            title: String,
            description: String,
            category: String,
            price: Number,
            idProd: Number
        }]
    },
})

export default mongoose.model("carts", cartsSchema);
