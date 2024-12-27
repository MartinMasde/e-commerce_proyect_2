import { verifyUser } from "../services/sessions.service.js";

import crypto from "crypto";
import {
  readById,
  update,
  readByEmail,
} from "../dao/mongo/managers/users.manager.js";
import { sendResetPasswordEmail } from "../utils/nodemailer.util.js";
import { createHashUtil } from "../utils/hash.util.js";

async function register(req, res, next) {
  const { _id } = req.user;
  const message = "User Registered!";
  return res.json201(_id, message);
}

async function login(req, res, next) {
  const { token, role } = req.user;
  const opts = { maxAge: 60 * 60 * 24 * 7, httpOnly: true };
  const message = "User logged in!";
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

// Funcion para verificar el email del usuario
async function verifyEmail(req, res) {
  const { email, verifyCode } = req.body;

  if (!email || !verifyCode) {
    return res
      .status(400)
      .json({ error: "Missing email or verification code" });
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

// Funcion para solicitar el reseteo de la contraseña
async function requestPasswordReset(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  try {
    const user = await readByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetCode = crypto.randomBytes(6).toString("hex");
    const resetCodeExpiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await update(user._id, { resetCode, resetCodeExpiration });

    await sendResetPasswordEmail({ to: email, resetCode });

    return res.status(200).json({ message: "Reset code sent to your email" });
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Funcion para resetear la contraseña
async function resetPassword(req, res) {
  const { email, resetCode, newPassword } = req.body;

  if (!email || !resetCode || !newPassword) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const user = await readByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.resetCode !== resetCode || user.resetCodeExpiration < new Date()) {
      return res.status(400).json({ error: "Invalid or expired reset code" });
    }

    const hashedPassword = createHashUtil(newPassword);

    await update(user._id, {
      password: hashedPassword,
      resetCode: null,
      resetCodeExpiration: null,
    });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export { register, login, signout, online, google, onlineToken, verifyEmail, requestPasswordReset, resetPassword};
