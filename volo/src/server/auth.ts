import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { loginOrRegister } from "~/server/lib/db/user";

declare module "next-auth" {
  interface Session {
    userId: string;
    expires: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      userId: token.sub,
      expires: session.expires,
    }),
  },
  session: { strategy: "jwt" },
  secret: env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: {
          label: "邮箱",
          type: "text",
          placeholder: "请输入邮箱（若无则自动注册）",
        },
        password: {
          label: "密码",
          type: "password",
          placeholder: "请输入密码",
        },
      },
      authorize: async (credentials, _) => {
        if (credentials?.email && credentials?.password) {
          return await auth(credentials.email, credentials.password);
        }
        return null;
      },
    }),
  ],
};

const auth = async (email: string, password: string) => {
  const user = await loginOrRegister(email, password);
  return user ? { id: user.id } : null;
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
