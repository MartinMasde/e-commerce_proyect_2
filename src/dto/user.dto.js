import crypto from "crypto";
import argsUtil from "../utils/args.util.js";

const { persistence } = argsUtil;

class UserDTO {
  constructor(data) {
    persistence !== "mongo" && (this._id = crypto.randomBytes(12).toString("hex"));
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.email = data.email;
    this.age = data.age;
    this.password = data.password;
    this.cart = data.cart || null;
    this.role = data.role || "USER";
    this.isOnline = data.isOnline || false;
    this.verifyUser = data.verifyUser || false;
    this.verifyCode = data.verifyCode || "1234";
    persistence !== "mongo" && (this.createdAt = new Date());
    persistence !== "mongo" && (this.updatedAt = new Date());
  }
}

export default UserDTO;