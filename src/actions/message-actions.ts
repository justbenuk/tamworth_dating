'use server'

import { messageSchema, MessageSchema } from '@/lib/schemas/message-schema';
import { ActionResult } from '@/types.index';
import { getAuthUserId } from './auth-actions';
import { db } from '@/lib/db';
import { Message } from '@prisma/client';
import { mapMessageToMessageDto } from '@/lib/mappings';

export async function createMessage(recipientUserId: string, data: MessageSchema): Promise<ActionResult<Message>>{
  try {
    const userId = await getAuthUserId()
    const validated = messageSchema.safeParse(data)

    if (!validated.success) return { status: 'error', error: validated.error.errors }
    
    const { text } = validated.data
    
    const message = await db.message.create({
      data: {
        text,
        recipientId: recipientUserId,
        senderId: userId
      }
    })

    return {status: 'success', data: message}
  } catch (error) {
    console.log(error)
    return {status: 'error', error: 'Something went wrong'}
  }
}

export async function getMessageThread(recipientId: string) {
  try {
    const userId = await getAuthUserId()
    const messages = await db.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            recipientId
          },
          {
            senderId: recipientId,
            recipientId: userId
          }
        ]
      },
      orderBy: {
        created: 'asc'
      },
      select: {
        id: true,
        text: true,
        created: true,
        dateRead: true,
        sender: {
          select: {
            userId: true,
            name: true,
            image: true
          }
        },
        recipient: {
          select: {
            userId: true,
            name: true,
            image: true
          }
        }

      }
    })

    return messages.map(message => mapMessageToMessageDto(message))
  } catch (error) {
    console.log(error)
    throw Error
  }
}