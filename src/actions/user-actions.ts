'use server'

import { memberEditSchema, MemberEditSchema } from "@/lib/schemas/member-edit-schema";
import { ActionResult } from "next/dist/server/app-render/types";
import { getAuthUserId } from "./auth-actions";
import { db } from "@/lib/db";
import { Photo } from "@prisma/client";
import { cloudinary } from "@/lib/cloudinary";

export async function updateMemberProfile(data: MemberEditSchema): Promise<ActionResult> {
  try {
    const userId = await getAuthUserId()
    const validated = memberEditSchema.safeParse(data)

    if (!validated.success) return { status: 'error', error: validated.error.errors }

    const { name, description, city, country } = validated.data

    const member = await db.member.update({
      where: { userId },
      data: {
        name,
        description,
        city,
        country
      }
    })

    return { status: 'success', data: member }
  } catch (error) {
    return { status: 'error', error: 'Something went wrong' }
  }
}

export async function addImage(url: string, publicId: string) {
  try {

    const userId = await getAuthUserId()

    return db.member.update({
      where: { userId },
      data: {
        photos: {
          create: [
            {
              url,
              publicId
            }
          ]
        }
      }
    })

  } catch (error) {
    throw new Error('Unable to upload image')
  }
}

export async function setMainImage(photo: Photo) {

  try {
    const userId = await getAuthUserId()

    await db.user.update({
      where: { id: userId },
      data: { image: photo.url }
    })

    return db.member.update({
      where: { userId },
      data: { image: photo.url }
    })

  } catch (error) {
    throw new Error('Unable to process image change')
  }
}

export async function deleteImage(photo: Photo) {
  try {
    const userId = await getAuthUserId()

    if (photo.publicId) {
      await cloudinary.v2.uploader.destroy(photo.publicId)
      return db.member.update({
        where: { userId },
        data: {
          photos: {
            delete: {
              id: photo.id
            }
          }
        }
      })
    }

  } catch (error) {
    throw new Error("Couldn't delete the image")
  }
}
