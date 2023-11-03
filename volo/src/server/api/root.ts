import { userInfoRouter } from "~/server/api/routers/user";
import { videoRouter } from "~/server/api/routers/video";
import { createTRPCRouter } from "~/server/api/trpc";
import { gorseRouter } from "./routers/gorse";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userInfoRouter,
  video: videoRouter,
  recommend: gorseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
