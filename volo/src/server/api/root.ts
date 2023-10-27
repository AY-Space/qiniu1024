import { userInfoRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import {videoRouter} from "~/server/api/routers/video";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user:   userInfoRouter,
  video:  videoRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
