import CustomRouter from "../../utils/CustomRouter.util.js";
import { readById } from "../../data/mongo/managers/users.manager.js";
import passportCb from "../../middlewares/passportCb.mid.js";

class SessionsApiRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }
  init = () => {
    this.create("/register", passportCb("register"), register);
    this.create("/login", passportCb("login"), login);
    this.create("/signout", passportCb("signout"), signout);
    this.create("/online", passportCb("online"), onlineToken);
    this.read("/google", passportCb("google", { scope: ["email", "profile"] })); // autenticación con google
    this.read("/google/callback", passportCb("google"), google); // estrategia de passport para google para login
    this.read("/current", passportCb("current"), current);
  };
}

let sessionsRouter = new SessionsApiRouter();
export default sessionsRouter.getRouter();

async function register(req, res, next) {
  const { _id } = req.user;
  const message = "User Registered!";
  return res.json201(_id, message);
}

async function login(req, res, next) {
    const { token } = req.user;
    const opts = { maxAge: 60 * 60 * 24 * 7, httpOnly: true };
    const message = "User logged in!";
    const response = "OK";
    return res.cookie("token", token, opts).json200(response, message);
  }

function signout(req, res, next) {
    const message = "User signed out!";
    const response = "OK";
    return res.clearCookie("token").json200(response, message);
  }

async function online(req, res, next) {
    const { user_id } = req.session;
    const user = await readById(user_id);
    if (req.session.user_id) {
      const message = user.email + " is online";
      const response = true;
      return res.json200(response, message);
    } else {
      const message = "User is not online";
      return res.json400(message);
    }
}

async function google(req, res, next) {
    return res.status(200).json({ message: "USER LOGGED IN WITH GOOGLE", token: req.token });
}

async function onlineToken(req, res, next) {
    return res.status(200).json({
      message: req.user.email.toUpperCase() + " IS ONLINE",
      online: true,
    });
  }

async function current(req, res, next) {
    const user = req.user;
    if(!user){
      message = "NO USER LOGGED IN"
      return res.json401(message);
    }
    return res.json200(user, "USER LOGGED IN");
  }
