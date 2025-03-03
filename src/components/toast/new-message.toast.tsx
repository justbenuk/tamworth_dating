import { MessageDto } from "@/types.index"
import { Image } from "@heroui/image"
import Link from "next/link"
import { toast } from "react-toastify"

type Props = {
  message: MessageDto
}
export function NewMessageToast({ message }: Props) {
  return (
    <Link href={`/members/${message.senderId}/chat`} className="flex items-center">
      <div className="mr-2">
        <Image src={message.senderImage || '/images/user.png'} alt="user profile image" height={50} width={50} />
      </div>
      <div className="flex flex-grow flex-col justify-center">
        <div className="font-semibold">{message.senderName} sent you a message</div>
        <div className="text-sm">Click to view</div>
      </div>
    </Link>
  )
}

export const newMessageToast = (message: MessageDto) => {
  toast(<NewMessageToast message={message} />)
}
