import { type Prisma, type PrismaClient, type User } from "@prisma/client";
import { compare } from "bcrypt";
import { db } from "~/server/db";
import { type UserPublic } from "~/types";

export const login = async (
  email: string,
  password: string,
): Promise<UserPublic | null> => {
  const user = await findUserByEmail(db, email);
  if (!user) {
    throw new Error("User not found");
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

const findUser = async (
  prisma: PrismaClient,
  where: Prisma.UserWhereUniqueInput,
): Promise<User | null> => {
  return await prisma.user.findUnique({
    where,
  });
};

export const findUserPublic = async (
  prisma: PrismaClient,
  id: string,
): Promise<UserPublic | null> => {
  return await findUser(prisma, { id });
};

const findUserByEmail = async (
  prisma: PrismaClient,
  email: string,
): Promise<User | null> => {
  return findUser(prisma, { email });
};
