'use server'
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { Photo } from "@prisma/client"
export async function getMembersAction() {

  //get the current logged in user  
  const session = await auth()

  //check if we have a session available 
  if (!session?.user) return null

  //get the users minus the current logged in user
  try {
    return db.member.findMany({
      where: {
        NOT: {
          userId: session.user.id
        }
      }
    })

  } catch (error) {
    throw new Error('Something went wrong')
  }
}

export async function getMemberByIdAction(userId: string) {
  try {
    return db.member.findUnique({
      where: {
        userId
      }
    })
  } catch (error) {
    throw new Error('Somethign went wrong')
  }
}

export async function getMembersPhotosByIdAction(userId: string) {
  try {
    const member = await db.member.findUnique({
      where: { userId },
      select: { photos: true }
    })

    if (!member) return null

    return member.photos.map(p => p) as Photo[]

  } catch (error) {
    throw new Error('Something went wrong')
  }

}
