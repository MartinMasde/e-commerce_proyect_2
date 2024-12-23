import { config } from "dotenv";
import argsUtil from "./args.util.js";

const { env } = argsUtil;

const path = "./.env." + env;
config({ path });

const envUtil = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  SECRET_KEY: process.env.SECRET_KEY,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  BASE_URL: process.env.BASE_URL,

  // GOOGLE_EMAIL: process.env.GOOGLE_EMAIL,
  // GOOGLE_PASSWORD: process.env.GOOGLE_PASSWORD,
  // MAIL_HOST: process.env.MAIL_HOST,
  // MAIL_PORT: process.env.MAIL_PORT,
};

export default envUtil;
