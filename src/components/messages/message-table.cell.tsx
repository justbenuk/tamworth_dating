import { truncateString } from "@/lib/utils"
import { Button } from "@heroui/react"
import { AiFillDelete } from "react-icons/ai"
import PresenceAvatar from "../presence-avatar"
import { MessageDto } from "@/types.index"

type Props = {
  item: MessageDto
  columnKey: string
  isOutbox: boolean
  deleteMessage: (message: MessageDto) => void
  isDeleting: boolean
}

export default function MessageTableCell({ item, columnKey, isOutbox, isDeleting, deleteMessage }: Props) {
  const cellValue = item[columnKey as keyof MessageDto]

  switch (columnKey) {
    case 'recipientName':
    case 'senderName':
      return (
        <div className="flex items-center gap-2 cursor-pointer">
          <PresenceAvatar
            userId={isOutbox ? item.recipientId : item.senderName} src={isOutbox ? item.recipientImage : item.senderImage}
          />
          <span>{cellValue}</span>
        </div>
      )
    case 'text':
      return (
        <div>{truncateString(cellValue)}</div>
      )
    case 'created':
      return cellValue
    default:
      return (
        <Button isIconOnly variant="light" onPress={() => deleteMessage(item)} isLoading={isDeleting}>
          <AiFillDelete size={24} className="text-danger" />
        </Button>
      )

  }

}
