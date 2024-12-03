import { readByEmail } from "../data/mongo/managers/users.manager.js";

async function isValidUser(req, res, next) {
  const { email, password } = req.body;
  const user = await readByEmail(email);
  if (user) {
    return next();
  }
  const error = new Error("INVALID CREDENTIALS");
  error.statusCode = 401;
  throw error;
}

export default isValidUser;
