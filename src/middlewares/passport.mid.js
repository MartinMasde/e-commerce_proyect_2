import passport from "passport";
import crypto from "crypto";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { create, readByEmail, readById, update,} from "../dao/mongo/managers/users.manager.js";
import { createHashUtil, verifyHashUtil } from "../utils/hash.util.js";
import { createTokenUtil, verifyTokenUtil } from "../utils/token.util.js";
import envUtil from "../utils/env.util.js";
import { sendVerifyEmail } from "../utils/nodemailer.util.js";
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BASE_URL, SECRET_KEY } = envUtil;

passport.use(
  "register",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
      try {
        const one = await readByEmail(email);
        if (one) {
          const info = { message: "USER ALREADY EXISTS", statusCode: 401 };
          return done(null, false, info);
        }
        const hashedPassword = createHashUtil(password);
        const verifyCode = crypto.randomBytes(12).toString("hex");
        const user = await create({
          email,
          password: hashedPassword,
          name: req.body.name || "Default Name",
          verifyCode
        });
        await sendVerifyEmail({ to: email, verifyCode: verifyCode });
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
        const user = await readByEmail(email);
        if (!user) {
          const info = { message: "USER NOT FOUND", statusCode: 401 };
          return done(null, false, info);
        }
        if (!user.verify) {
          const info = { message: "Please verify your account ", statusCode: 401 };
          return done(null, false, info);
        }
        const passwordForm = password;
        const passwordDb = user.password;
        const verify = verifyHashUtil(passwordForm, passwordDb);
        if (!verify) {
          const info = { message: "INVALID CREDENTIALS", statusCode: 401 };
          return done(null, false, info);
        }
        const data = { user_id: user._id, role: user.role };
        const token = createTokenUtil(data);
        user.token = token;
        await update(user._id, { isOnline: true });
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
        const user = await readById(user_id);
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
        const user = await readById(user_id);
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
        await update(user_id, { isOnline: false });

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
        const { id, picture } = profile;
        let user = await readByEmail(id);
        if (!user) {
          user = await create({
            email: id,
            photo: picture,
            password: createHashUtil(id),
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

