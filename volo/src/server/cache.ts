import { createClient } from "redis";
import { env } from "~/env.mjs";

export const cache = await createClient({
  url: env.REDIS_URL,
})
  .on("error", (err) => {
    console.error("cache error: ", err);
  })
  .connect();

process.on("exit", () => {
  cache.quit().catch(() => {
    console.error("cache quit error");
  });
});
