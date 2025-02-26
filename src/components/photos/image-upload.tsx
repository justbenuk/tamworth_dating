'use client'
import { CldUploadButton, CloudinaryUploadWidgetResults } from 'next-cloudinary'
import { HiPhoto } from 'react-icons/hi2'

type Props = {
  onUploadImageAction: (result: CloudinaryUploadWidgetResults) => void
}
export default function ImageUploadButton({ onUploadImageAction }: Props) {
  return (
    <CldUploadButton options={{ maxFiles: 1 }} onSuccess={onUploadImageAction} signatureEndpoint='/api/sign-image'
      uploadPreset='mm-demo' className='flex items-center gap-2 bg-gray-900 text-white rounded-lg py-2 px-4 hover:bg-red-500'>
      <HiPhoto size={28} />
      Upload New Image
    </CldUploadButton>
  )
}
