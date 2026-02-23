import prisma from "./prisma";

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

export async function setRefreshToken(userId, token) {
  let idValue = userId;
  if (typeof userId === "string" && /^\d+$/.test(userId)) idValue = BigInt(userId);
  if (typeof userId === "number") idValue = BigInt(userId);
  await prisma.user.update({ where: { id: idValue }, data: { refreshToken: token } });
}
