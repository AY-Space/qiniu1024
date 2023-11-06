import { Client } from "@elastic/elasticsearch";
import { env } from "~/env.mjs";

export const es = new Client({
  node: env.ES_URL,
  auth: {
    username: env.ES_USERNAME,
    password: env.ES_PASSWORD,
  },
});
