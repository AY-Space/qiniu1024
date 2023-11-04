import { userRouter } from "~/server/api/routers/user";
import { videoRouter } from "~/server/api/routers/video";
import { createTRPCRouter } from "~/server/api/trpc";
import { gorseRouter } from "./routers/gorse";
import { collectionRouter } from "./routers/collection";
import { tagRouter } from "./routers/tag";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  video: videoRouter,
  recommend: gorseRouter,
  collection: collectionRouter,
  tag: tagRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
