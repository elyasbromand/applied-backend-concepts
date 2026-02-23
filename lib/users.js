import prisma from "./prisma";
import bcrypt from "bcryptjs";

export async function findUserByEmail(email) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id) {
  let idValue = id;
  if (typeof id === "string" && /^\d+$/.test(id)) idValue = BigInt(id);
  if (typeof id === "number") idValue = BigInt(id);
  return await prisma.user.findUnique({ where: { id: idValue } });
}

export async function createUser({ email, passwordHash, name = null }) {
  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });
  return user;
}

// Stores a hashed refresh token for the user. The incoming `token` is expected
// to be the raw token in the format "<userId>.<random>". We only hash and
// store the random part.
export async function setRefreshToken(userId, token) {
  let idValue = userId;
  if (typeof userId === "string" && /^\d+$/.test(userId))
    idValue = BigInt(userId);
  if (typeof userId === "number") idValue = BigInt(userId);

  const parts = String(token).split(".");
  const randomPart = parts[1] || "";
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(randomPart, salt);

  await prisma.user.update({
    where: { id: idValue },
    data: { refreshToken: hashed },
  });
}

export async function clearRefreshToken(userId) {
  let idValue = userId;
  if (typeof userId === "string" && /^\d+$/.test(userId))
    idValue = BigInt(userId);
  if (typeof userId === "number") idValue = BigInt(userId);
  await prisma.user.update({
    where: { id: idValue },
    data: { refreshToken: null },
  });
}

// Verify a raw token. The token format is expected to be "<userId>.<random>".
// Returns the user if valid, otherwise null.
export async function findUserByRefreshToken(token) {
  if (!token) return null;
  const parts = String(token).split(".");
  const userId = parts[0];
  const randomPart = parts[1];
  if (!userId || !/^[0-9]+$/.test(userId) || !randomPart) return null;

  const idValue = BigInt(userId);
  const user = await prisma.user.findUnique({ where: { id: idValue } });
  if (!user || !user.refreshToken) return null;

  const ok = await bcrypt.compare(randomPart, user.refreshToken);
  return ok ? user : null;
}
