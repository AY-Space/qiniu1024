import { z } from "zod";
import { type CollectionWithVideos, type CollectionPublic } from "~/types";
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

  updateVideo: protectedProcedure
    .input(
      z.object({
        collectionId: z.string(),
        videoId: z.string(),
        operation: z.enum(["connect", "disconnect"]),
      }),
    )
    .mutation(
      async ({
        input: { collectionId, videoId, operation },
        ctx: { db, session },
      }) => {
        await db.collection.update({
          where: {
            id: collectionId,
            ownerId: session.userId,
          },
          data: {
            videos: {
              [operation]: {
                id: videoId,
              },
            },
          },
        });
      },
    ),

  create: protectedProcedure
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

  idsWithVideo: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
      }),
    )
    .query(
      async ({
        input: { videoId },
        ctx: { db, session },
      }): Promise<string[]> => {
        const collections = await db.collection.findMany({
          where: {
            ownerId: session.userId,
            videos: {
              some: {
                id: videoId,
              },
            },
          },
          select: {
            id: true,
          },
        });

        return collections.map((collection) => collection.id);
      },
    ),

  videos: protectedProcedure
    .input(
      z.object({
        collectionId: z.string(),
      }),
    )
    .query(
      async ({
        input: { collectionId },
        ctx: { db, session },
      }): Promise<CollectionWithVideos> => {
        const collection = await db.collection.findUnique({
          where: {
            id: collectionId,
            ownerId: session.userId,
          },
          select: {
            id: true,
            name: true,
            videos: {
              select: {
                id: true,
                title: true,
                coverUrl: true,
                createdAt: true,
                views: true,
              },
            },
          },
        });
        if (!collection) {
          throw new Error("Collection not found or you don't have access");
        }
        return collection;
      },
    ),
});
