import { readById } from "../dao/mongo/managers/users.manager.js";
import { verifyUser } from "../services/sessions.service.js";

async function register(req, res, next) {
  const { _id } = req.user;
  const message = "User Registered!";
  return res.json201(_id, message);
}

async function login(req, res, next) {
  // const { token } = req.user;
  const { token, role } = req.user;
  const opts = { maxAge: 60 * 60 * 24 * 7, httpOnly: true };
  const message = "User logged in!";
  // const response = "OK";
  const response = { token, role };
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

// funcion para redirigir al frontend con el token de google luego de la autenticación
async function google(req, res, next) {
  const token = req.token;
  const frontendUrl = `http://localhost:3000/login?googleAuth=true&token=${token}`;
  return res.redirect(frontendUrl);
}

async function onlineToken(req, res, next) {
  return res.status(200).json({
    message: req.user.email.toUpperCase() + " IS ONLINE",
    online: true,
  });
}

// async function verifyEmail(req, res) {
//   const { email, verifyCodeFromClient } = req.body;
//   // if (!email || !verifyCodeFromClient) {
//   //   return res.status(400).json({ message: "Missing email or verification code" });
//   // }
//   const response = await verifyUser(email, verifyCodeFromClient);
//   if (response) {
//     const message = "Email verified!";
//     return res.json200('OK', message);
//   } else {
//     return res.json401()
//   }
// }

// async function verifyEmail(req, res) {
//   const { email, verifyCode } = req.body;
//   const response = await verifyUser(email, verifyCode);
//   if (response) {
//     const message = "Email verified!";
//     return res.json200("OK", message);
//   } else {
//     return res.json401();
//   }
// }


async function verifyEmail(req, res) {
  const { email, verifyCode } = req.body;

  if (!email || !verifyCode) {
    return res.status(400).json({ error: "Missing email or verification code" });
  }

  try {
    const isVerified = await verifyUser(email, verifyCode);
    if (isVerified) {
      return res.json({ message: "Email verified successfully!" });
    } else {
      return res.status(401).json({ error: "Verification failed." });
    }
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}


export { register, login, signout, online, google, onlineToken, verifyEmail }; 

