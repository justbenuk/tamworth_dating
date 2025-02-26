'use server'

import { registerSchema, RegisterSchema } from "@/lib/schemas/register-schema";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { ActionResult } from "@/types.index";
import { User } from "@prisma/client";
import { LoginSchema } from "@/lib/schemas/login-schema";
import { auth, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function signOutUserAction() {
  await signOut({ redirectTo: '/' })

}

export async function signInUser(data: LoginSchema): Promise<ActionResult<string>> {
  try {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false
    })

    return { status: 'success', data: 'Login Successful' }
  } catch (error) {
    console.log(error)
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { status: 'error', error: 'Invalid Credentials' }
        default:
          return { status: 'error', error: 'Something went wrong' }
      }
    } else {
      return { status: 'error', error: 'Something Went Wrong' }
    }
  }
}

export async function registerUserAction(data: RegisterSchema): Promise<ActionResult<User>> {

  try {

    const validated = registerSchema.safeParse(data)

    if (!validated.success) {
      return { status: 'error', error: validated.error.errors }
    }

    const { name, email, password } = validated.data
    const hashedPassword = await bcrypt.hash(password, 10)

    const exisitingUser = await db.user.findUnique({
      where: {
        email
      }
    })

    if (exisitingUser) {
      return {
        status: 'error', error: 'User already exists'
      }
    }

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    })

    if (!user) {
      return {
        status: 'error', error: 'something went wrong'
      }
    }

    return { status: 'success', data: user }
  } catch (error) {
    console.log(error)
    return { status: 'error', error: 'Something went wrong' }
  }
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email }
  })
}

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id }
  })
}

export async function getAuthUserId() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) throw new Error('Unauthorised')

  return userId
}
