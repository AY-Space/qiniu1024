import { type PrismaClient, type User } from "@prisma/client";

import { compare, hash } from "bcrypt";
import { db } from "~/server/db";

export const authenticate = async (
  email: string,
  password: string,
): Promise<User | null> => {
  const user = await exists(db, email);
  if (!user) {
    return await create(db, email, await hash(password, 10));
  }
  if (user.password === null) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("User has no password");
    }
    return user;
  }
  if (await compare(password, user.password)) {
    return user;
  }
  throw new Error("Invalid Password");
};

const exists = async (
  prisma: PrismaClient,
  email: string,
): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const create = async (
  prisma: PrismaClient,
  email: string,
  encryptedPassword: string,
): Promise<User> => {
  return await prisma.user.create({
    data: {
      email,
      password: encryptedPassword,
    },
  });
};
