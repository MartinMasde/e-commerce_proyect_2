import crypto from "crypto";
import argsUtil from "../utils/args.util.js";

const { persistence } = argsUtil;

class ProductsDTO {
  constructor(data) {
    persistence !== "mongo" && (this._id = crypto.randomBytes(12).toString("hex"));
    this.title = data.title;
    this.photo = data.photo;
    this.price = data.price || 1;
    this.stock = data.stock || 1;
    this.category = data.category || "televisores";
    this.code = data.code;
    persistence !== "mongo" && (this.createdAt = new Date());
    persistence !== "mongo" && (this.updatedAt = new Date());
  }
}

export default ProductsDTO