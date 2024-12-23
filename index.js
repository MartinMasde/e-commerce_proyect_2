import envUtil from './src/utils/env.util.js';
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

const corsOptions = {
  origin: 'http://localhost:3000', // Origen permitido se puede pasar por una variable de entorno (.env)
  credentials: true, // Permitir credenciales (cookies, encabezados de autorización, etc.)
};
server.use(cors(corsOptions)); // CORS para permitir peticiones desde cualquier origen - peticion desde el front ecommerce-frontend

const port = envUtil.PORT;
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
server.use(cookieParser(envUtil.SECRET_KEY)); // Manejo de cookies

// Configuracion de session con mongo storage
server.use(session({
  secret: envUtil.SECRET_KEY, resave: true, saveUninitialized: true,
  store: new MongoStore({ mongoUrl: envUtil.MONGO_URI, ttl: 60*60*24 })
}))

// Routers
server.use(indexRouter);
server.use(errorHandler);
server.use(pathHandler);
