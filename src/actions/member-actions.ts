'use server'
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { Photo } from "@prisma/client"
import { UserFilters } from "@/types.index"
import { addYears } from "date-fns"
import { getAuthUserId } from "./auth-actions"

export async function getMembersAction(searchParams: UserFilters) {

  //get the current logged in user  
  const session = await auth()

  //check if we have a session available 
  if (!session?.user) return null

  const ageRange = searchParams?.ageRange?.toString().split(',') || [18, 100]

  const currentDate = new Date()
  const minDob = addYears(currentDate, -ageRange[1] - 1)
  const maxDob = addYears(currentDate, -ageRange[0])

  const orderBySelector = searchParams?.orderBy || 'updated'
  const selectedGender = searchParams?.gender?.toString()?.split(',') || ['male', 'female']

  //get the users minus the current logged in user
  try {
    return db.member.findMany({
      where: {
        AND: [
          { dateOfBirth: { gte: minDob } },
          { dateOfBirth: { lte: maxDob } },
          { gender: { in: selectedGender } }
        ],
        NOT: {
          userId: session.user.id
        }
      },
      orderBy: { [orderBySelector]: 'desc' }
    })

  } catch (error) {
    throw error
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
    throw error
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
    throw error
  }

}

export async function updatesLastActive() {
  const userId = await getAuthUserId()

  try {
    return db.member.update({
      where: { userId },
      data: { updated: new Date() }
    })

  } catch (error) {
    throw error
  }
}
