import {userProfiles} from "@/drizzle/schema/user_profiles";
import {users} from "@/drizzle/schema/users";
import {db} from "@/lib/db";
import {eq} from "drizzle-orm";
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
    async signIn({user}) {
      // Check if the user already exists
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, user.email!))
        .then((res) => res[0]);

      if (!existing) {
        // Create a new user in the database
        const inserted = await db
          .insert(users)
          .values({
            email: user.email!,
            emailVerified: true,
            hashedPassword: "", // no password for oauth
          })
          .returning({id: users.id});

        const userId = inserted[0].id;

        // Create the user's profile
        await db.insert(userProfiles).values({
          userId,
          firstName: user.name || null,
          avatarUrl: user.image || null,
        });

        user.id = userId; // Store DB id into user.id
      } else {
        user.id = existing.id; // Existing user - get DB id
      }

      return true;
    },

    async jwt({token, user}) {
      // On initial sign in, attach the DB user id and email
      if (user) {
        token.sub = user.id;
        if (user.email) {
          token.email = user.email;
        }
        if (user.name) {
          token.name = user.name; // Optional, future-proof
        }
        if (user.image) {
          token.picture = user.image; // Optional, for avatar
        }
      }
      return token;
    },

    async session({session, token}) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.email = token.email ?? ""; // ensure email is passed
        session.user.name = token.name ?? null; // optional
        session.user.image = token.picture ?? null; // optional
      }
      return session;
    },
  },
});
