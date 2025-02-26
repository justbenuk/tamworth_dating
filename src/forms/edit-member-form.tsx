'use client'
import { updateMemberProfile } from "@/actions/user-actions"
import { MemberEditSchema, memberEditSchema } from "@/lib/schemas/member-edit-schema"
import { handleFormServerErrors } from "@/lib/utils"
import { Button } from "@heroui/button"
import { Input, Textarea } from "@heroui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Member } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"


type MemberProps = {
  member: Member
}

export default function MemberEditForm({ member }: MemberProps) {
  const router = useRouter()
  const { register, handleSubmit, reset, setError, formState: { isValid, isDirty, isSubmitting, errors } } = useForm<MemberEditSchema>({
    resolver: zodResolver(memberEditSchema),
    mode: 'onTouched'
  })

  useEffect(() => {
    if (member) {
      reset({
        name: member.name,
        description: member.description,
        city: member.city,
        country: member.country
      })
    }
  }, [member, reset])

  async function onSubmit(data: MemberEditSchema) {
    const result = await updateMemberProfile(data)

    if (result.status === 'success') {

      toast.success('Profile Updated')
      router.refresh()
      reset({ ...data })
    } else {
      handleFormServerErrors(result, setError)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
      <Input
        label='Name'
        variant="bordered"
        {...register('name')}
        defaultValue={member.name}
        isInvalid={!!errors.name}
        errorMessage={errors?.name?.message}
      />
      <Textarea
        label='Description'
        variant="bordered"
        {...register('description')}
        defaultValue={member.description}
        isInvalid={!!errors.description}
        errorMessage={errors?.description?.message}
        minRows={6}
      />
      <div className="flex flex-row gap-3">
        <Input
          label='City'
          variant="bordered"
          {...register('city')}
          defaultValue={member.city}
          isInvalid={!!errors.city}
          errorMessage={errors?.city?.message}
        />
        <Input
          label='Country'
          variant="bordered"
          {...register('country')}
          defaultValue={member.country}
          isInvalid={!!errors.country}
          errorMessage={errors?.country?.message}
        />
      </div>
      {errors.root?.serverError && (
        <p className="text-danger text-sm">{errors.root.serverError.message}</p>
      )}
      <div className="w-full flex justify-end">
        <Button type='submit' variant="solid" isDisabled={!isValid || !isDirty} isLoading={isSubmitting} className="bg-red-500 text-white">Update Profile</Button>
      </div>
    </form>
  )
}

