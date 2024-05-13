import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

import { pool } from "@/utils/db";
const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const { rows } = await pool.query(
          "SELECT * FROM users WHERE email=$1",
          [credentials?.email as string]
        );

        const user = rows[0];
        const passwordCorrect = await compare(
          credentials?.password || "",
          user.password
        );
        if (passwordCorrect) {
          return {
            id: user.id,
            email: user.email,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.

      return session;
    },
  },
});

export { handler as GET, handler as POST };
