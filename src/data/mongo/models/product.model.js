import { model, Schema } from "mongoose";

const collection = "products"
 
const schema = new Schema({
    title: { type: String, required: true, index: true },
    photo: { type: String, default: "path/to/default/image.jpg" },
    price: { type: Number, default: 1 },
    stock: { type: Number, default: 1 },
    category: { type: String, enum: ["televisores", "audio", "heladeras"], default: "televisores"},
    code: { type: String, required: true, unique: true }
})

const Product = model(collection, schema)
export default Product