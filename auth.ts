import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const {handlers, auth, signIn, signOut} = NextAuth({
  providers: [Google],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({session, token}) {
      session.user.id = token.sub!;
      return session;
    },
  },
});
