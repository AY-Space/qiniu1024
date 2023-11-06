import { TagType } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  categories: publicProcedure.query(async ({ ctx }): Promise<string[]> => {
    const tags = await ctx.db.tag.findMany({
      where: {
        type: TagType.Category,
      },
      select: {
        name: true,
      },
    });
    return tags.map((tag) => tag.name);
  }),

  tags: protectedProcedure.query(async ({ ctx }): Promise<string[]> => {
    const tags = await ctx.db.tag.findMany({
      where: {
        type: TagType.Tag,
      },
      select: {
        name: true,
      },
    });
    return tags.map((tag) => tag.name);
  }),
});
