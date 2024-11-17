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
import cors from 'cors';

//  Server
const server = express();

server.use(cors()); // CORS para permitir peticiones desde cualquier origen - peticion desde el front ecommerce-frontend

const port = process.env.PORT;
const ready = () => {
  console.log(`Server running on port ${port}`);
  dbConnect();
}
server.listen(port, ready);

// Middlewares 
server.use(express.json()); // Manejo de json
server.use(express.urlencoded({ extended: true })); // Manejo de formularios
// server.use(express.static("public")); // Manejo de archivos estaticos
server.use(morgan("dev")); // Manejo de Morgan para logs
server.use(cookieParser(process.env.SECRET_KEY)); // Manejo de cookies

// Configuracion de session con mongo storage
server.use(session({
  secret: process.env.SECRET_KEY, resave: true, saveUninitialized: true,
  store: new MongoStore({ mongoUrl: process.env.MONGO_URI, ttl: 60*60*24 })
}))

// Routers
server.use(indexRouter);
server.use(errorHandler);
server.use(pathHandler);
