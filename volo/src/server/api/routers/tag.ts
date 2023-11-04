import { TagType } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { type TagPublic } from "~/types";

export const tagRouter = createTRPCRouter({
  categories: protectedProcedure.query(
    async ({ ctx }): Promise<TagPublic[]> => {
      const tags = await ctx.db.tag.findMany({
        where: {
          type: TagType.Category,
        },
      });
      return tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        type: tag.type,
      }));
    },
  ),
});
