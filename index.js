import "dotenv/config.js";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import indexRouter from "./src/routers/index.router.js";
import pathHandler from "./src/middlewares/pathHandler.mid.js";
import errorHandler from "./src/middlewares/errorHandler.mid.js";
import dbConnect from "./src/utils/dbConnect.util.js";


//  Server
const server = express();
const port = process.env.PORT;
const ready = () => {
  console.log(`Server running on port ${port}`);
  dbConnect();
}
server.listen(port, ready);


// Middlewares para manejo de json
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
// Middleware para manejo de morgan
server.use(morgan("dev"));
// Middleware para manejo de cookies
server.use(cookieParser(process.env.SECRET_KEY));

// Middleware para manejo de sesiones
// server.use(session({
//   secret: process.env.SECRET_KEY,
//   resave: true,
//   saveUninitialized: true,
//   cookie: { maxAge: 60000 }
// }));

// Configuracion de session con mongo storage
server.use(session({
  secret: process.env.SECRET_KEY, resave: true, saveUninitialized: true,
  store: new MongoStore({ mongoUrl: process.env.MONGO_URI, ttl: 60*60*24 })
}))

// Routers
server.use(indexRouter);
server.use(errorHandler);
server.use(pathHandler);
