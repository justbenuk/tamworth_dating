import { getMemberByIdAction } from "@/actions/member-actions"
import { notFound } from "next/navigation"
import CardInnerWrapper from "@/components/card-inner-wrapper"

export default async function MemberPage({ params }: { params: { userId: string } }) {
  const { userId } = await params
  const member = await getMemberByIdAction(userId)

  if (!member) return notFound()

  return (
    <CardInnerWrapper header='Profile' body={<div>{member.description}</div>} />
  )
}
