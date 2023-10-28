import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

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
    session: ({ session, user }) => ({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      expires: session.expires,
    }),
  },
  session: { strategy: "jwt" },
  jwt: {
    maxAge: 60 * 60 * 24 * 7,
  },
  secret: env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "Email",
      credentials: {
        name: {
          label: "name",
          type: "text",
          placeholder: "login don't need enter the name",
        },
        email: {
          label: "email",
          type: "text",
          placeholder: "please enter the email",
        },
      },
      async authorize(credentials, _) {
        return !credentials?.email
          ? null
          : await initUser(credentials.email, credentials.name);
      },
    }),
  ],
};

const initUser = async (email: string, name: string | null) => {
  const user = await authenticate(name, email );

  if (!user) {
    return null;
  }
  return {
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
