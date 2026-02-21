import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "change-me";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export function sign(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verify(token) {
  return jwt.verify(token, SECRET);
}
