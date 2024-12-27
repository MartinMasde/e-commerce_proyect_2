import CustomRouter from "../../utils/CustomRouter.util.js";
import { createProduct, readProducts, updateProduct, destroyProduct } from "../../controllers/products.controller.js";

class ProductsApiRouter extends CustomRouter {
    constructor() {
      super();
      this.init();
    }
    init = () => {
        this.create("/", ["ADMIN"], createProduct)
        this.read("/", ["PUBLIC"], readProducts)
        this.update("/:id", ["ADMIN"],  updateProduct)
        this.destroy("/:id", ["ADMIN"], destroyProduct)
    }
}

let productsApiRouter = new ProductsApiRouter();
export default productsApiRouter.getRouter();

