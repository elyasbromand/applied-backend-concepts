import db from "./db.js";

export async function findUserByEmail(email) {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ? LIMIT 1", [
    email,
  ]);
  return rows[0] || null;
}

export async function findUserById(id) {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ? LIMIT 1", [
    id,
  ]);
  return rows[0] || null;
}

export async function createUser({ email, passwordHash, name = null }) {
  const [result] = await db.query(
    "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
    [email, passwordHash, name],
  );
  const insertId = result.insertId;
  return findUserById(insertId);
}

export async function setRefreshToken(userId, token) {
  await db.query("UPDATE users SET refresh_token = ? WHERE id = ?", [
    token,
    userId,
  ]);
}
