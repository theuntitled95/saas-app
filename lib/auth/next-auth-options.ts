import {db} from "@/lib/db";
import {DrizzleAdapter} from "@auth/drizzle-adapter";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // optional: reuse your existing login page
  },
  callbacks: {
    async session({session, token}) {
      session.user.id = token.sub;
      return session;
    },
  },
};
