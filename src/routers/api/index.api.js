import CustomRouter from "../../utils/CustomRouter.util.js";
import productsApiRouter from "./products.api.js";
import cartsApiRouter from "./carts.api.js";
import usersApiRouter from "./users.api.js";
import sessionsRouter from "./sessions.api.js";

class ApiRouter extends CustomRouter {
    constructor() {
      super();
      this.init();
    }
    init = () => {
        this.use("/products", productsApiRouter)
        this.use("/carts", cartsApiRouter)
        this.use("/users", usersApiRouter)
        this.use("/sessions", sessionsRouter)
    }
}

let apiRouter = new ApiRouter();
export default apiRouter.getRouter();