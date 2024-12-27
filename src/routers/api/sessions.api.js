import CustomRouter from "../../utils/CustomRouter.util.js";
import passportCb from "../../middlewares/passportCb.mid.js";
import { register, login, signout, onlineToken, google, verifyEmail, requestPasswordReset, resetPassword } from "../../controllers/sessions.controller.js";

class SessionsApiRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }
  init = () => {
    this.create("/register", ["PUBLIC"], passportCb("register"), register);
    this.create("/login", ["PUBLIC"], passportCb("login"), login);
    this.create("/signout", ["USER", "ADMIN"], signout);
    this.create("/online", ["USER", "ADMIN"], onlineToken);
    this.read("/google", ["PUBLIC"], passportCb("google", { scope: ["email", "profile"] })); // autenticación con google
    this.read("/google/callback", ["PUBLIC"], passportCb("google"), google); // estrategia de passport para google para login
    this.create("/verify", ["PUBLIC"], /* passportCb("verify"), */ verifyEmail); // verificar email con código de verificación
    this.create("/password-reset/request", ["PUBLIC"], requestPasswordReset); // Solicitar código de reseteo
    this.create("/password-reset/verify", ["PUBLIC"], resetPassword); // Verificar código y cambiar contraseña
  };
}

let sessionsRouter = new SessionsApiRouter();
export default sessionsRouter.getRouter();

