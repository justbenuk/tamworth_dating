import { useCallback, useEffect, useRef } from 'react'
import usePresenceStore from './use-pressence-store'
import { Channel, Members } from 'pusher-js'
import { pusherClient } from '@/lib/pusher'
import { useShallow } from 'zustand/shallow'
import { updatesLastActive } from '@/actions/member-actions'

export const usePresenceChannel = () => {
  const { set, add, remove } = usePresenceStore(
    useShallow(
      state => ({
        set: state.set,
        add: state.add,
        remove: state.remove
      })))

  const channelRef = useRef<Channel | null>(null)

  const handleSetMembers = useCallback((memberIds: string[]) => {
    set(memberIds)
  }, [set])

  const handleAddMember = useCallback((memberId: string) => {
    add(memberId)
  }, [add])

  const handelRemoveMember = useCallback((memberId: string) => {
    remove(memberId)
  }, [remove])

  useEffect(() => {
    if (!channelRef.current) {
      channelRef.current = pusherClient.subscribe('presence-nm')

      channelRef.current.bind('pusher:subscription_succeeded', async (members: Members) => {
        handleSetMembers(Object.keys(members.members))
        await updatesLastActive()
      })

      channelRef.current.bind('pusher:member_added', (member: { id: string }) => {
        handleAddMember(member.id)
      })

      channelRef.current.bind('pusher:member_removed', (member: { id: string }) => {
        handelRemoveMember(member.id)
      })
    }

    return () => {
      if (channelRef.current && channelRef.current.subscribed) {
        channelRef.current.unsubscribe()
        channelRef.current.unbind_all()
      }
    }
  }, [handelRemoveMember, handleAddMember, handleSetMembers])
}
