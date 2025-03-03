'use server'

import { messageSchema, MessageSchema } from '@/lib/schemas/message-schema';
import { ActionResult, MessageDto } from '@/types.index';
import { getAuthUserId } from './auth-actions';
import { db } from '@/lib/db';
import { mapMessageToMessageDto } from '@/lib/mappings';
import { pusherServer } from '@/lib/pusher';
import { createChatId } from '@/lib/utils';

export async function createMessage(recipientUserId: string, data: MessageSchema): Promise<ActionResult<MessageDto>> {
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
      },
      select: messageSelect
    })

    const messageDto = mapMessageToMessageDto(message)

    //pusher 
    await pusherServer.trigger(createChatId(userId, recipientUserId), 'message:new', messageDto)
    await pusherServer.trigger(`private-${recipientUserId}`, 'message:new', messageDto)


    return { status: 'success', data: messageDto }
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
      select: messageSelect
    })

    if (messages.length > 0) {
      const readMessageIds = messages
        .filter(m => m.dateRead === null && m.recipient?.userId === userId && m.sender?.userId === recipientId)
        .map(m => m.id)
      await db.message.updateMany({
        where: { id: { in: readMessageIds } },
        data: {
          dateRead: new Date()
        }
      })

      await pusherServer.trigger(createChatId(recipientId, userId), 'messages:read', readMessageIds)
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
      select: messageSelect,
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

const messageSelect = {
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
