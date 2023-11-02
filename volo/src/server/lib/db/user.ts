import { type PrismaClient, type User } from "@prisma/client";

import { db } from "~/server/db";
import { compare, hash } from "bcrypt";

export const authenticate = async (
  email: string,
  password: string,
): Promise<User | null> => {
  const user = await exists(db, email);
  if (!user) return await create(db, email, await hash(password, email));
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

export const exists = async (
  prisma: PrismaClient,
  email: string,
): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const create = async (
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

export const getFollowerList = async (prisma: PrismaClient, userId: string) => {
  const follows = await prisma.follow.findMany({
    where: {
      followingId: userId,
    },
    select: {
      follower: true,
    },
  });

  return follows.map((follow) => {
    return follow.follower;
  });
};

export const getFollowingList = async (
  prisma: PrismaClient,
  userId: string,
) => {
  const follows = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    select: {
      following: true,
    },
  });

  return follows.map((follow) => {
    return follow.following;
  });
};
