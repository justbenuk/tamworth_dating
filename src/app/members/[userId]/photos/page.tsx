import { getMembersPhotosByIdAction } from "@/actions/member-actions"
import { CardHeader, CardBody } from "@heroui/card"
import { Divider } from "@heroui/divider"
import { Image } from "@heroui/image"
export default async function MembersPhotos({ params }: { params: { userId: string } }) {
  const photos = await getMembersPhotosByIdAction(params.userId)

  return (
    <>
      <CardHeader className="text-2xl font-semibold text-secondary">Profile</CardHeader>
      <Divider />
      <CardBody>
        <div className="grid grid-cols-5 gap-3">
          {photos && photos.map(photo => (
            <div key={photo.id}>
              <Image
                width={300}
                height={300}
                src={photo.url}
                alt='image of user'
                className="object-cover aspect-square"
              />
            </div>
          ))}</div>
      </CardBody>
    </>
  )
}
