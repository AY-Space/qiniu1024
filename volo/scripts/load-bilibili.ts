import "dotenv/config";

import { db } from "~/server/db";

import testJson from "./delete-this.json";

const main = async () => {
  const users = await db.user.findMany();
  console.log(users.slice(0, 10));

  console.log(testJson);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
