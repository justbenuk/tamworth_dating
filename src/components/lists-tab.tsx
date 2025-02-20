'use client'

import { Tabs, Tab } from "@heroui/react"
import { Member } from "@prisma/client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Key, useTransition } from "react"
import MemberItem from "./members/members-item"
import LoadingComponent from "./loading/loading-component"

type ListTabsProps = {
  members: Member[]
  listIds: string[]
}

export default function ListTabs({ members, listIds }: ListTabsProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const tabs = [
    { id: 'source', label: 'Members I have liked' },
    { id: 'target', label: 'Members that liked me' },
    { id: 'mutual', label: 'Mutual Likes' },
  ]

  function handleTabChange(key: Key) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      params.set('type', key.toString())
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="flex w-full flex-col mt-10 gap-5">
      <Tabs
        aria-label="Like tabs"
        items={tabs}
        color="secondary"
        onSelectionChange={(key) => handleTabChange(key)}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            {isPending ? (
              <LoadingComponent />
            ) : (
              <>
                {members.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                    {members.map(member => (
                      <MemberItem key={member.id} member={member} likeIds={listIds} />
                    ))}
                  </div>
                ) : (
                  <div>No Memebrs for this filter</div>
                )}
              </>
            )}
          </Tab>
        )}
      </Tabs>
    </div>
  )
}
