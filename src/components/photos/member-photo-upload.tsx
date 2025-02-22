'use client'

import { useRouter } from "next/navigation"
import ImageUploadButton from "./image-upload"
import { CloudinaryUploadWidgetResults } from "next-cloudinary"
import { addImage } from "@/actions/user-actions"
import { toast } from "react-toastify"

export default function MemberPhotoUpload() {
  const router = useRouter()
  const onAddImage = async (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info === 'object') {
      await addImage(result.info.secure_url, result.info.public_id)
      router.refresh()
    } else {
      toast.error('Image upload failed')
    }
  }
  return (
    <div className="pt-5 pl-5">
      <ImageUploadButton onUploadImageAction={onAddImage} />
    </div>
  )
}
