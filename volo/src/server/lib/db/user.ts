import { type PrismaClient, type User } from "@prisma/client";

import { db } from "~/server/db";
import { check, encrypt } from "~/server/lib/util/password";

export const authenticate = async (
  email: string,
  password: string,
): Promise<User | null> => {
  try {
    const user = await exists(db, email);
    if (!user) return await create(db, email, await encrypt(password,email));
    if (await check(password,user.password)){
      return user;
    }
    throw new Error("Invalid Password");
  } catch (error) {
    console.error("Error in Authenticate:", error);
    throw error;    
  }
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
