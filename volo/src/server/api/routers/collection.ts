import { z } from "zod";
import { type CollectionPublic } from "~/types";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const collectionRouter = createTRPCRouter({
  myCollections: protectedProcedure.query(
    async ({ ctx: { db, session } }): Promise<CollectionPublic[]> => {
      return await db.collection.findMany({
        where: {
          ownerId: session.userId,
        },
        select: {
          id: true,
          name: true,
        },
      });
    },
  ),

  addVideoToCollection: protectedProcedure
    .input(
      z.object({
        collectionId: z.string(),
        videoId: z.string(),
      }),
    )
    .mutation(
      async ({ input: { collectionId, videoId }, ctx: { db, session } }) => {
        // Verify that the collection belongs to the current user
        await db.collection.update({
          where: {
            id: collectionId,
            ownerId: session.userId,
          },
          data: {
            videos: {
              connect: {
                id: videoId,
              },
            },
          },
        });
      },
    ),

  createCollection: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ input: { name }, ctx: { db, session } }) => {
      await db.collection.create({
        data: {
          name,
          ownerId: session.userId,
        },
      });
    }),
});
