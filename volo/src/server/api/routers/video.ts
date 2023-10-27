import {createTRPCRouter, protectedProcedure, publicProcedure} from "~/server/api/trpc";
import {z} from "zod";

export const videoRouter = createTRPCRouter({
    list:publicProcedure.query(() => {
        return []
    }),
    recommend: protectedProcedure.query(({}) => {
        return [];
    }),
    create: protectedProcedure.
        input(z.object(
            {
                title:z.string().min(4),
                description:z.string().max(400),
                videoUrl:z.string().url(),
                coverUrl:z.string().url(),
            }
        )).
        mutation(async ({ctx,input}) => {
            await ctx.db.video.create(
                {
                    data:{
                        title:input.title,
                        description:input.description,
                        url:input.videoUrl,
                        coverUrl: input.coverUrl,
                        authorId:"111",
                        score:0,
                    }
                }
            )
        }),
    upload: protectedProcedure.
        input(z.object({files:z.array(z.string())})).
        mutation(({input}) => {
            return input.files.forEach((file) => {
                return file // convert file to upload url
            })
        }),
});