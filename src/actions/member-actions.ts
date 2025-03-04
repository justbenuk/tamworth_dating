'use server'
import { db } from "@/lib/db"
import { Photo } from "@prisma/client"
import { getMemberPrams } from "@/types.index"
import { addYears } from "date-fns"
import { getAuthUserId } from "./auth-actions"

export async function getMembersAction({
  ageRange = '18,100',
  gender = 'male,female',
  orderBy = 'updated',
  pageNumber = '1',
  pageSize = '12'
}: getMemberPrams) {

  const userId = await getAuthUserId()
  //get the current logged in user  

  const [minAge, maxAge] = ageRange.split(',')
  const currentDate = new Date()
  const minDob = addYears(currentDate, -maxAge - 1)
  const maxDob = addYears(currentDate, -minAge)

  const selectedGender = gender.split(',')

  const page = parseInt(pageNumber)
  const limit = parseInt(pageSize)
  const skip = (page - 1) * limit
  //get the users minus the current logged in user
  try {
    const count = await db.member.count({
      where: {
        AND: [
          { dateOfBirth: { gte: minDob } },
          { dateOfBirth: { lte: maxDob } },
          { gender: { in: selectedGender } }
        ],
        NOT: {
          userId
        }
      }
    })
    const members = await db.member.findMany({
      where: {
        AND: [
          { dateOfBirth: { gte: minDob } },
          { dateOfBirth: { lte: maxDob } },
          { gender: { in: selectedGender } }
        ],
        NOT: {
          userId
        }
      },
      orderBy: { [orderBy]: 'desc' },
      skip,
      take: limit
    })

    return {
      items: members,
      totalCount: count
    }

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
