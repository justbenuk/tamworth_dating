'use client'
import { Tabs, Tab } from "@heroui/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Key, useTransition } from "react"
import LoadingComponent from "@/components/loading/loading-component"
import { MessageDto } from "@/types.index"
import MessageTable from "./message-table"

type Props = {
  messages: MessageDto[]
}

export default function MessageTabs({ messages }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const tabs = [
    { id: 'inbox', label: 'Inbox' },
    { id: 'outbox', label: 'Outbox' },
  ]

  function handleTabChange(key: Key) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      params.set('container', key.toString())
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="flex w-full flex-col mt-10 gap-5">
      <Tabs
        aria-label="Like tabs"
        items={tabs}
        classNames={{
          tabList: [
            'flex',
            'flex-col',
            'w-full',
            'md:flex-row'
          ],
          tab: [
            'bg-red-500',
          ],
          tabContent: [
            'text-white'
          ]
        }}
        onSelectionChange={(key) => handleTabChange(key)}
      >
        {(item) => (
          <Tab key={item.id} title={item.label} className="flex flex-col lg:flex-row items-center justify-center">
            {isPending ? (
              <LoadingComponent />
            ) : (
              <>
                <MessageTable initialMessages={messages} />
              </>
            )}
          </Tab>
        )}
      </Tabs>
    </div >
  )
}
