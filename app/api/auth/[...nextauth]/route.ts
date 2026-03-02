import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { findOrCreateUser, getUserByPhone } from "@/lib/db/actions/user-actions";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "phone-otp",
      name: "Phone Number",
      credentials: {
        phone: { label: "Phone", type: "text" },
        name: { label: "Name", type: "text" },
        verified: { label: "Verified", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || credentials.verified !== "true") {
          return null;
        }

        const phone = credentials.phone.startsWith("+91")
          ? credentials.phone
          : `+91${credentials.phone}`;

        // Find or create user
        const user = await findOrCreateUser({
          name: credentials.name || phone,
          phone,
          provider: "phone",
        });

        return {
          id: user._id.toString(),
          name: user.name,
          phone: user.phone,
          email: user.email || undefined,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await findOrCreateUser({
          name: user.name || "User",
          email: user.email || undefined,
          image: user.image || undefined,
          provider: "google",
        });
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // On initial sign in, get the DB user ID
        if (account?.provider === "google" && user.email) {
          const { getUserByEmail } = await import("@/lib/db/actions/user-actions");
          const dbUser = await getUserByEmail(user.email);
          if (dbUser) {
            token.userId = dbUser._id.toString();
            token.phone = dbUser.phone;
          }
        } else if (account?.provider === "phone-otp") {
          token.userId = user.id;
          token.phone = (user as { phone?: string }).phone;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.userId as string;
        (session.user as { phone?: string }).phone = token.phone as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // We use a modal, not a page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
