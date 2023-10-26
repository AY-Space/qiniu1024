import { api } from "~/trpc/server";

const Test = async () => {
  const data = await api.post.hello.query({ text: "World" });
  return <div>{data.greeting}</div>;
};

export default Test;
