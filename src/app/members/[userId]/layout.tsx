import { getMemberByIdAction } from "@/actions/member-actions";
import MembersSidebar from "@/components/members/members-sidebar";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { Card } from "@heroui/card";
export default async function MembersLayout({ children, params }: { children: ReactNode, params: { userId: string } }) {
  const { userId } = await params
  const member = await getMemberByIdAction(userId)
  const basePath = `/members/${member?.userId}`
  if (!member) return notFound()

  const navLinks = [
    { name: 'Profile', href: `${basePath}` },
    { name: 'Photos', href: `${basePath}/photos` },
    { name: 'Chat', href: `${basePath}/chat` }
  ]

  return (
    <div className="grid grid-cols-12 gap-5 h-[80vh]">
      <div className="col-span-3">
        <MembersSidebar member={member} navLinks={navLinks} />
      </div>
      <div className="col-span-9">
        <Card className="w-full mt-10 h-[80dvh]">{children}</Card>
      </div>
    </div>
  )

}
