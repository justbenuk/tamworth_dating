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
      <CardHeader className="text-md font-semibold text-red-500">Edit Profile</CardHeader>
      <Divider />
      <CardBody>
        <MemberEditForm member={member} />
      </CardBody>
    </>
  )
}
