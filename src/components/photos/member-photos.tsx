'use client'

import { Photo } from "@prisma/client"
import DeleteButton from "./delete-button"
import MemberImage from "./member-image"
import StarButton from "./star-button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { deleteImage, setMainImage } from "@/actions/user-actions"
import { toast } from "react-toastify"

type Props = {
  photos: Photo[] | null
  editing?: boolean
  mainImageUrl?: string | null
}

export default function MemberPhotos({ photos, editing, mainImageUrl }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState({
    type: '',
    isLoading: false,
    id: ''
  })


  async function onSetMain(photo: Photo) {
    if (photo.url === mainImageUrl) return null
    setLoading({ isLoading: true, id: photo.id, type: 'main' })
    await setMainImage(photo)
    router.refresh()
    setLoading({ isLoading: false, type: '', id: '' })
    toast.success('Photo Changed')
  }

  async function onDelete(photo: Photo) {
    if (photo.url === mainImageUrl) return null
    setLoading({ isLoading: true, id: photo.id, type: 'delete' })
    await deleteImage(photo)
    router.refresh()
    setLoading({ isLoading: false, type: '', id: '' })
    toast.success('Photo Deleted')

  }
  return (
    <div className="grid grid-cols-5 gap-3 p-5">
      {photos && photos.map(photo => (
        <div key={photo.id} className="relative">
          <MemberImage photo={photo} />
          {editing && (
            <>
              <div onClick={() => onSetMain(photo)} className="absolute top-3 left-3 z-50">
                <StarButton selected={photo.url === mainImageUrl} loading={loading.isLoading && loading.type === 'main' && loading.id === photo.id} />
              </div>
              <div className="absolute top-3 right-3 z-50" onClick={() => onDelete(photo)}>
                <DeleteButton loading={loading.isLoading && loading.type === 'delete' && loading.id === photo.id} />
              </div>
            </>
          )}
        </div>
      ))}
    </div>

  )
}
