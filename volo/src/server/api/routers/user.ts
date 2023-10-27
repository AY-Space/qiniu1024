import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const userInfoRouter = createTRPCRouter({
  update: protectedProcedure.
  input(z.object({
    name:z.string().min(4),
    signature:z.string().max(400),
    avatarUrl:z.string().url(),
  })).
  mutation(({input}) => {

  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
