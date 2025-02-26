import { getAuthUserId } from "@/actions/auth-actions";
import { getMemberByIdAction, getMembersPhotosByIdAction } from "@/actions/member-actions";
import MemberPhotoUpload from "@/components/photos/member-photo-upload";
import MemberPhotos from "@/components/photos/member-photos";
import { CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";

export default async function PhotosPage() {
  const userId = await getAuthUserId()
  const photos = await getMembersPhotosByIdAction(userId)
  const member = await getMemberByIdAction(userId)
  return (
    <>
      <CardHeader className="text-md font-semibold text-red-500">Change Photos</CardHeader>
      <Divider />
      <CardBody>
        <MemberPhotoUpload />
        <MemberPhotos photos={photos} editing={true} mainImageUrl={member?.image} />
      </CardBody>
    </>
  )
}
