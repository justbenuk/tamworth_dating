'use server'

import { db } from "@/lib/db";
import { getAuthUserId } from "./auth-actions";

export async function toggleLikeMember(targetUserId: string, isLiked: boolean) {
  try {

    const userId = await getAuthUserId()

    if (isLiked) {
      await db.like.delete({
        where: {
          sourceUserId_targetUserId: {
            sourceUserId: userId,
            targetUserId
          }
        }
      })
    } else {
      await db.like.create({
        data: {
          sourceUserId: userId,
          targetUserId
        }
      })
    }
  } catch {
    throw new Error('Something Went Wrong')
  }
}

export async function fetchCurrentUserLikeIds() {

  try {
    const userId = await getAuthUserId()

    const likeIds = await db.like.findMany({
      where: {
        sourceUserId: userId
      },
      select: {
        targetUserId: true,
      }
    })

    return likeIds.map(like => like.targetUserId)

  } catch (error) {
    throw new Error('Something Went Wrong')
  }



}

export async function fetchLikedMembers(type = 'source') {
  try {
    const userId = await getAuthUserId()

    switch (type) {
      case 'source':
        return await fetchSourceLikes(userId)
      case 'target':
        return await fetchTargetLikes(userId)
      case 'mutual':
        return await fecthMutualLikes(userId)
      default:
        return []
    }

  } catch (error) {
    throw new Error('Something went wrong')
  }
}
async function fetchSourceLikes(userId: string) {
  const sourceList = await db.like.findMany({
    where: {
      sourceUserId: userId
    },
    select: { targetMember: true }
  })

  return sourceList.map(x => x.targetMember)

}


async function fetchTargetLikes(userId: string) {
  const targetList = await db.like.findMany({
    where: {
      targetUserId: userId
    },
    select: { sourceMember: true }
  })

  return targetList.map(x => x.sourceMember)
}

async function fecthMutualLikes(userId: string) {
  const likedUsers = await db.like.findMany({
    where: {
      sourceUserId: userId
    },
    select: { targetUserId: true }
  })

  const likedIds = likedUsers.map(x => x.targetUserId)

  const mutualList = await db.like.findMany({
    where: {
      AND: [
        { targetUserId: userId },
        { sourceUserId: { in: likedIds } }
      ]
    },
    select: { sourceMember: true }
  })

  return mutualList.map(x => x.sourceMember)
}
