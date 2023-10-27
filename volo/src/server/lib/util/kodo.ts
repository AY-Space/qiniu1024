import { auth, form_up, rs } from "qiniu";
import { env } from "~/env.mjs";

const accessKey = env.QINIU_ACCESS_KEY;
const secretKey = env.QINIU_SECRET_KEY;
const bucket = env.QINIU_BUCKET;

const uploader = new form_up.FormUploader();
const putExtra = new form_up.PutExtra();
const mac = new auth.digest.Mac(accessKey, secretKey);

export const UpToken = (key: string, time?: number) => {
  return new rs.PutPolicy({
    scope: bucket + ":" + key,
    expires: time ?? 60,
  }).uploadToken(mac);
};

export const UploadFile = async (
  token: string,
  key: string,
  localFile: string,
) => await uploader.putFile(token, key, localFile, putExtra, callback);

const callback = (err?: Error, body?: unknown, info?: unknown) => {
  if (err) {
    console.log(err);
    return;
  }
  if (info !== null && typeof info === "object" && "statusCode" in info) {
    if (info.statusCode == 200) {
      console.log(body); // `body` contains `hash` and `key`
    } else {
      console.log(info.statusCode, body);
    }
  }
};
