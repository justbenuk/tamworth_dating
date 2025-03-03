'use client'
import { pusherClient } from "@/lib/pusher"
import { MessageDto } from "@/types.index"
import { usePathname, useSearchParams } from "next/navigation"
import { Channel } from "pusher-js"
import { useCallback, useEffect, useRef } from "react"
import useMessageStore from "./use-message-store"
import { useShallow } from "zustand/shallow"
import { newMessageToast } from "@/components/toast/new-message.toast"

export const useNotificationChannel = (userId: string | null) => {
  const channelRef = useRef<Channel | null>(null)
  const pathname = usePathname()
  const searchparams = useSearchParams()
  const { add } = useMessageStore(
    useShallow(state => ({
      add: state.add
    })))

  const handleNewMessage = useCallback((message: MessageDto) => {
    if (pathname === '/messages' && searchparams.get('container') !== 'outbox') {
      add(message)
    } else if (pathname !== `/members/${message.senderId}/chat`) {
      newMessageToast(message)
    }
  }, [add, pathname, searchparams])

  useEffect(() => {
    if (!userId) return
    if (!channelRef.current) {
      channelRef.current = pusherClient.subscribe(`private-${userId}`)
      channelRef.current.bind('message:new', handleNewMessage)
    }

    return () => {
      if (channelRef.current && channelRef.current.subscribed) {
        channelRef.current.unsubscribe()
        channelRef.current.unbind_all()
        channelRef.current = null
      }
    }
  }, [userId, handleNewMessage])
}
