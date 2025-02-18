import NextAuth from "next-auth"
import { db } from "./lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "./lib/schemas/login-schema"
import { getUserByEmail } from "./actions/auth-actions"
import { compare } from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      name: 'credentials',
      async authorize(creds) {
        const validated = loginSchema.safeParse(creds)

        if (validated.success) {
          const { email, password } = validated.data

          const user = await getUserByEmail(email)
          if (!user || !(await compare(password, user.passwordHash))) {
            return null
          }

          return user

        }

        return null
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    }
  },
})
