import { getMemberByIdAction } from "@/actions/member-actions";
import MembersSidebar from "@/components/members/members-sidebar";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { Card } from "@heroui/card";
import { getAuthUserId } from "@/actions/auth-actions";

export default async function MembersLayout({ children }: { children: ReactNode }) {

  const userId = await getAuthUserId()
  const member = await getMemberByIdAction(userId)

  const basePath = `/members/edit`

  if (!member) return notFound()

  const navLinks = [
    { name: 'Edit Profile', href: `${basePath}` },
    { name: 'Update Photos', href: `${basePath}/photos` },
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
