import { model, Schema } from "mongoose";

const collection = "users"

const schema = new Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, required: true, index: true, unique: true },
    age: { type: Number },
    password: { type: String, required: true },
    cart: { type: Schema.Types.ObjectId, ref: 'carts'},
    role: { type: String, enum: ['USER','ADMIN'], default: 'USER' },
    isOnline: { type: Boolean, default: false }

})

const User = model(collection, schema)
export default User