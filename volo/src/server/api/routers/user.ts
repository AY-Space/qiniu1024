import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const userInfoRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(4),
        signature: z.string().max(400),
        avatarUrl: z.string().url(),
      }),
    )
    .mutation(({ input }) => {}),
import {
  FirstOrCreate,
} from "~/server/lib/db/user";

const login = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      name: z.string().min(4).nullable(),
    }),
  )
  .query(({ ctx, input }) => {
    return FirstOrCreate(ctx.db, { email: input.email, name: input.name });
  });
export const userInfoRouter = createTRPCRouter({
  // only for credential login, email not exists will create a new user
  login: login,
});
