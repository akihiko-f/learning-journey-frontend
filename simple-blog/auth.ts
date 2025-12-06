import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { validateEmail, validatePassword } from '@/lib/validation'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string
          password: string
        }

        // バリデーション
        const emailValidation = validateEmail(email)
        if (!emailValidation.valid) {
          return null
        }

        const passwordValidation = validatePassword(password)
        if (!passwordValidation.valid) {
          return null
        }

        // ユーザー検索
        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          return null
        }

        // パスワード検証
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
          return null
        }

        // ユーザー情報を返す（passwordは除外）
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
})
