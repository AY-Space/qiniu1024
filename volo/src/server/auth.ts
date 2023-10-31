import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { authenticate } from "~/server/lib/db/user";

declare module "next-auth" {
  interface Session {
    user: User;
    expires: string;
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
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
      user: {
        id: token.sub,
        email: token.email,
        name: token.name,
        avatar: token.avatar,
      },
      expires: session.expires,
    }),
    jwt: ({ token }) => {
      return {
        ...token,
        id: token.sub,
        email: token.email,
        name: token.name,
        avatar: token.avatar,
      };
    },
  },
  session: { strategy: "jwt" },
  jwt: {
    maxAge: 60 * 60 * 24 * 7,
  },
  secret: env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "please enter the email",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "please enter the password",
        },
      },
      async authorize(credentials, _) {
        return !credentials?.email || !credentials?.password
          ? null
          : await initUser(credentials.email, credentials.password);
      },
    }),
  ],
};

const initUser = async (email: string, password: string) => {
  const user = await authenticate(email, password);
  return !user
    ? null
    : {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatarUrl,
      };
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
