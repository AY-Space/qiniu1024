"use client";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export const NextSessionProvider = ({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
