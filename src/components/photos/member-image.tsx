'use client'
import { Photo } from "@prisma/client"
import { CldImage } from "next-cloudinary"
import { Image } from "@heroui/image"

type Props = {
  photo: Photo | null
}

export default function MemberImage({ photo }: Props) {
  return (
    <div>
      {photo?.publicId ? (
        <CldImage alt='image of member' src={photo.publicId} width={300} height={300} crop='fill' gravity="faces" className="rounded-2xl" />
      ) : (
        <Image
          width={220}
          src={photo?.url || '/imaages/user.png'}
          alt="image of user" />
      )}</div>
  )

}
