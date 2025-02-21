'use server'

import { memberEditSchema, MemberEditSchema } from "@/lib/schemas/member-edit-schema";
import { ActionResult } from "next/dist/server/app-render/types";
import { getAuthUserId } from "./auth-actions";
import { db } from "@/lib/db";

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
