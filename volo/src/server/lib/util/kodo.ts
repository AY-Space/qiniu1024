import { createId } from "@paralleldrive/cuid2";
import { auth, rs } from "qiniu";
import { env } from "~/env.mjs";

const mac = new auth.digest.Mac(env.QINIU_ACCESS_KEY, env.QINIU_SECRET_KEY);

export const createUploadParameters = () => {
  const key = createId();
  const token = new rs.PutPolicy({
    scope: `${env.QINIU_BUCKET}:${key}`,
  }).uploadToken(mac);
  return {
    token,
    key,
  };
};
