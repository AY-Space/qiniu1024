import { type PrismaClient, type User } from "@prisma/client";

export const FirstOrCreate = async (
  prisma: PrismaClient,
  user: Pick<User, "name" | "email">,
) => {
  try {
    return await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name ?? user.email,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in FirstOrCreate:", error);
    throw error;
  }
};

export const GetFollowerList = async (prisma: PrismaClient, userId: string) => {
  try {
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
  } catch (error) {
    console.error("Error in GetFollowerList:", error);
    throw error;
  }
};

export const GetFollowingList = async (
  prisma: PrismaClient,
  userId: string,
) => {
  try {
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
  } catch (error) {
    console.error("Error in GetFollowerList:", error);
    throw error;
  }
};
