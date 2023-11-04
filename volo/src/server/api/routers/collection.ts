import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { type CollectionPublic } from "~/types";

export const collectionRouter = createTRPCRouter({
  myCollections: protectedProcedure.query(
    async ({ ctx: { db, session } }): Promise<CollectionPublic[]> => {
      return await db.collection.findMany({
        where: {
          ownerId: session.user.id,
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
            ownerId: session.user.id,
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
          ownerId: session.user.id,
        },
      });
    }),
});
