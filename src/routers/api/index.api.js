import { Router } from "express";
import productsApiRouter from "./products.api.js";
import cartsApiRouter from "./carts.api.js";
import usersApiRouter from "./users.api.js";
import cookiesRouter from "./cookies.api.js";
import sessionsRouter from "./sessions.api.js";

const apiRouter = Router()

apiRouter.use("/products", productsApiRouter)
apiRouter.use("/carts", cartsApiRouter)
apiRouter.use("/users", usersApiRouter)
apiRouter.use("/cookies", cookiesRouter)
apiRouter.use("/sessions", sessionsRouter)

export default apiRouter