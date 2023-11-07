import "dotenv/config";
import { searchUser, searchVideo } from "~/server/lib/search/elasticsearch";

const sentence = "我想学编程";
void (async () => {
  await searchVideo(sentence);
  await searchUser(sentence);
})();
