import { model, Schema } from "mongoose";

const collection = "users";

const schema = new Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String, required: true, index: true, unique: true },
  age: { type: Number },
  password: { type: String },
  cart: { type: Schema.Types.ObjectId, ref: "carts" },
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  isOnline: { type: Boolean, default: false },
  verifyCode: { 
    type: String, 
    required: function () { return !this.googleId; } // No requerido si googleId está presente 
  },
  verify: { type: Boolean, default: false }, // Estado de verificación de email
  googleId: { type: String }, // ID del usuario autenticado con Google

  resetCode: { type: String }, // Código de reseteo de contraseña
  resetCodeExpiration: { type: Date }, // Fecha de expiración del código de reseteo
  });
 

const User = model(collection, schema);
export default User;
