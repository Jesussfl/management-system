import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth";
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import Credentials from "@auth/core/providers/credentials"
import type { Adapter } from '@auth/core/adapters';
export const authOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
              const { email, password } = credentials as {
                  email: string;
                  password: string;
                
              };
                // check to see if email and password is there
                if(!email || !password) {
                   return null
                }
  
                // check to see if user exists
                const user = await prisma.usuario.findUnique({
                    where: {
                        email
                    }
                });
                // if no user was found 
                if (!user || !user?.contrasena) {
  
                 return null
                }
  
                // check to see if password matches
                const passwordMatch = await bcrypt.compare(password, user.contrasena)
  
                // if password does not match
                if (passwordMatch) {
                    return user;
                }

                return null
  
            },
        }),  
    ],
  session:{
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
   signIn: "/auth/login",
  },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.rol_nombre = user.rol_nombre
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id
        session.user.rol_nombre = token.rol_nombre
      }
      return session
    },
    authorized(params) {
      return !!params.auth?.user;
    },
  }
 
  
} satisfies NextAuthConfig

export const { 
    handlers, 
    auth, 
    signOut,
    signIn, 
  } = NextAuth(authOptions)