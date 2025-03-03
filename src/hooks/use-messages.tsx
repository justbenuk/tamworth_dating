'use client'
import { deleteMessage } from "@/actions/message-actions";
import { MessageDto } from "@/types.index";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { Key } from "readline";
import useMessageStore from "./use-message-store";
import { useShallow } from "zustand/shallow";

export const useMessages = (initialMessages: MessageDto[]) => {
  const { set, messages } = useMessageStore(
    useShallow(
      state => ({
        set: state.set,
        remove: state.remove,
        messages: state.messages
      })
    ))
  const searchParams = useSearchParams();
  const isOutbox = searchParams.get("container") === "outbox";
  const router = useRouter()
  const [isDeleting, setDeleting] = useState({ id: '', loading: false })

  useEffect(() => {
    set(initialMessages)

    return () => {
      set([])
    }
  }, [initialMessages, set])

  const columns = [
    {
      key: isOutbox ? "recipientName" : "senderName",
      label: isOutbox ? "Recipient" : "Sender",
    },
    { key: "text", label: "Message" },
    {
      key: "created",
      label: isOutbox ? "Date Sent" : "Date Received",
    },
    {
      key: "actions",
      label: 'Actions',
    }
  ];

  const handleDeleteMessage = useCallback(async (message: MessageDto) => {
    setDeleting({
      id: message.id,
      loading: true
    })
    await deleteMessage(message.id, isOutbox)
    router.refresh()
    setDeleting({
      id: '',
      loading: false
    })
  }, [isOutbox, router])

  function handleRowSelect(key: Key) {
    const message = messages.find(m => m.id === key)
    const url = isOutbox ? `/members/${message?.recipientId}` : `/members/${message?.senderId}`
    router.push(url + '/chat')
  }

  return {
    isOutbox,
    columns,
    deleteMessage: handleDeleteMessage,
    selectRow: handleRowSelect,
    isDeleting, messages,
  }


}
