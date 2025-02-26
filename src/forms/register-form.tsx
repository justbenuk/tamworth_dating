'use client'

import { Card, CardBody } from "@heroui/card"
import { Input } from "@heroui/input"
import { Button } from "@heroui/button"
import { useForm } from "react-hook-form"
import { registerSchema, RegisterSchema } from "@/lib/schemas/register-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerUserAction } from "@/actions/auth-actions"
import { handleFormServerErrors } from "@/lib/utils"
import Image from "next/image"
import reg from './reg.jpg'

export default function LoginForm() {
  const { register, handleSubmit, setError, formState: { errors, isValid, isSubmitting } } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched'
  })

  async function onSubmit(data: RegisterSchema) {
    const result = await registerUserAction(data)

    if (result.status === 'success') {
      console.log('User has registered')
    } else {
      handleFormServerErrors(result, setError)
    }
  }
  return (
    <Card className="w-4/5 mx-auto p-0">
      <CardBody className="grid grid-cols-1 lg:grid-cols-4 p-0">
        <div className="col-span-2">
          <Image src={reg} alt='login image' height={300} className="w-full h-[500px] aspect-square origin-center" />
        </div>
        <div className="col-span-2 p-12">
          <div className="py-4">
            <h1 className="text-red-500 font-semibold text-xl">Welcome to Tamworth Dating</h1>
            <p className="mt-2">This website was created for fun</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Input
                label='Name'
                variant="bordered"
                {...register('name')}
                defaultValue=""
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
              />
              <Input
                label='Email'
                variant="bordered"
                {...register('email')}
                defaultValue=""
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
              />
              <Input
                label='Password'
                type='password'
                variant="bordered"
                {...register('password')}
                defaultValue="" isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
              />
              {errors.root?.serverError && (
                <p className="text-danger text-sm">{errors.root.serverError.message}</p>
              )}
              <Button isLoading={isSubmitting} isDisabled={!isValid} fullWidth className="bg-red-500 text-white" type='submit'>Login</Button>
            </div>
          </form>
        </div>
      </CardBody>
    </Card>
  )
}
