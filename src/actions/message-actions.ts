'use server'

import { messageSchema, MessageSchema } from '@/lib/schemas/message-schema';
import { ActionResult } from '@/types.index';
import { getAuthUserId } from './auth-actions';
import { db } from '@/lib/db';
import { Message } from '@prisma/client';
import { mapMessageToMessageDto } from '@/lib/mappings';

export async function createMessage(recipientUserId: string, data: MessageSchema): Promise<ActionResult<Message>> {
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

    return { status: 'success', data: message }
  } catch (error) {
    console.log(error)
    return { status: 'error', error: 'Something went wrong' }
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
            recipientId,
            senderDelete: false
          },
          {
            senderId: recipientId,
            recipientId: userId,
            recipientDeleted: false
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

    if (messages.length > 0) {
      await db.message.updateMany({
        where: {
          senderId: recipientId,
          recipientId: userId,
          dateRead: null
        },
        data: {
          dateRead: new Date()
        }
      })
    }

    return messages.map(message => mapMessageToMessageDto(message))
  } catch (error) {
    console.log(error)
    throw Error
  }
}

export async function getMessagesByContainer(container: string) {
  try {
    const userId = await getAuthUserId()

    const conditions = {
      [container === 'outbox' ? 'senderId' : 'recipientId']: userId,
      ...(container === 'outbox' ? { senderDelete: false } : { recipientDeleted: false })
    }
    const messages = await db.message.findMany({
      where: conditions,
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
      },
      orderBy: {
        created: 'desc'
      }
    })

    return messages.map(message => mapMessageToMessageDto(message))
  } catch (error) {
    console.log(error)
    throw new Error('Unable to load messages')
  }
}

export async function deleteMessage(messageId: string, isOutbox: boolean): Promise<void> {
  const selector = isOutbox ? 'senderDelete' : 'recipientDeleted'

  try {
    const userId = await getAuthUserId()

    await db.message.update({
      where: { id: messageId },
      data: {
        [selector]: true
      }
    })

    const messagesToDelete = await db.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            senderDelete: true,
            recipientDeleted: true
          },
          {
            recipientId: userId,
            senderDelete: true,
            recipientDeleted: true

          }
        ]
      }
    })

    if (messagesToDelete.length > 0) {
      await db.message.deleteMany({
        where: {
          OR: messagesToDelete.map(m => ({ id: m.id }))
        }
      })
    }
  } catch (error) {
    console.log(error)
    throw new Error('something went wrong')
  }
}
