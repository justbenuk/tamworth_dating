import { getAuthUserId } from "@/actions/auth-actions"
import { getMemberByIdAction } from "@/actions/member-actions"
import MemberEditForm from "@/forms/edit-member-form"
import { CardHeader, CardBody } from "@heroui/card"
import { Divider } from "@heroui/divider"
import { notFound } from "next/navigation"
export default async function EditMembers() {
  const userId = await getAuthUserId()
  const member = await getMemberByIdAction(userId)

  if (!member) return notFound()

  return (
    <>
      <CardHeader className="text-2xl font-semibold text-secondary"> Edit Profile</CardHeader>
      <Divider />
      <CardBody>
        <MemberEditForm member={member} />
      </CardBody>
    </>
  )
}
