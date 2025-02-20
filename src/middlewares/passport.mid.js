import passport from "passport";
import crypto from "crypto";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
// import { create, readByEmail, readById, update,} from "../dao/mongo/managers/users.manager.js";
import dao from "../dao/index.factory.js";
import { createHashUtil, verifyHashUtil } from "../utils/hash.util.js";
import { createTokenUtil, verifyTokenUtil } from "../utils/token.util.js";
import envUtil from "../utils/env.util.js";
import { sendVerifyEmail } from "../utils/nodemailer.util.js";
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BASE_URL, SECRET_KEY } = envUtil;
const { UsersManager } = dao;


passport.use(
  "register",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
      try {
        const existingUser = await UsersManager.readByEmail(email);
        if (existingUser) {
          const info = { message: "USER ALREADY EXISTS", statusCode: 401 };
          return done(null, false, info);
        }

        const hashedPassword = createHashUtil(password);
        const verifyCode = crypto.randomBytes(12).toString("hex");

        // Crear usuario
        const user = await UsersManager.create({
          email,
          password: hashedPassword,
          name: req.body.name || "Default Name",
          verifyCode,
          verify: false, // Estado inicial para usuarios no verificados
        });

        // Enviar email de verificación
        await sendVerifyEmail({ to: email, verifyCode });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await UsersManager.readByEmail(email);

        if (!user) {
          const info = { message: "USER NOT FOUND", statusCode: 401 };
          return done(null, false, info);
        }

        // Validación de verificación (excepto usuarios de Google)
        if (!user.verify && !user.googleId) {
          const info = { message: "Please verify your account", statusCode: 401 };
          return done(null, false, info);
        }

        // Validar contraseña (usuarios no-Google)
        if (!user.googleId) {
          const passwordForm = password;
          const passwordDb = user.password;

          if (!verifyHashUtil(passwordForm, passwordDb)) {
            const info = { message: "INVALID CREDENTIALS", statusCode: 401 };
            return done(null, false, info);
          }
        }

        // Generar token
        const data = { user_id: user._id, role: user.role };
        const token = createTokenUtil(data);

        user.token = token;

        // Actualizar estado de conexión
        await UsersManager.update(user._id, { isOnline: true });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "admin",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
      secretOrKey: envUtil.SECRET_KEY,
    },
    async (data, done) => {
      try {
        const { user_id, role } = data;
        if (role !== "ADMIN") {
          const info = { message: "NOT AUTHORIZE", statusCode: 403 };
          return done(null, false, info);
        }
        const user = await UsersManager.readById(user_id);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "online",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
      secretOrKey: envUtil.SECRET_KEY,
    },
    async (data, done) => {
      try {
        const { user_id } = data;
        const user = await UsersManager.readById(user_id);
        const { isOnline } = user;
        if (!isOnline) {
          const info = { message: "USER IS NOT ONLINE", statusCode: 401 };
          return done(null, false, info);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "signout",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
      secretOrKey: envUtil.SECRET_KEY,
    },
    async (data, done) => {
      try {
        const { user_id } = data;
        await UsersManager.update(user_id, { isOnline: false });

        return done(null, { user_id: null });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      passReqToCallback: true,
      callbackURL: `${BASE_URL}/sessions/google/callback`,
      scope: ["email", "profile"],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const { id, emails, photos } = profile;
        const email = emails[0].value;
        const picture = photos[0].value;

        let user = await UsersManager.readByEmail(email);

        if (!user) {
          user = await UsersManager.create({
            email,
            googleId: id, // Guardar el ID de Google
            verify: true, // Usuarios de Google están verificados automáticamente
            password: createHashUtil(id), // Contraseña hashada con Google ID
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            photo: picture
          });
        }

        req.headers.token = createTokenUtil({
          role: user.role,
          user: user._id,
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;

