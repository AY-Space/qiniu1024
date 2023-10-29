import { auth, rs } from "qiniu";
import { env } from "~/env.mjs";

const mac = new auth.digest.Mac(env.QINIU_ACCESS_KEY, env.QINIU_SECRET_KEY);

export const UpToken = (key: string, time?: number) => {
  return new rs.PutPolicy({
    scope: `${env.QINIU_BUCKET}:${key}`,
    expires: time ?? 60,
  }).uploadToken(mac);
};