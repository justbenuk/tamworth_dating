'use client'

import { Card, CardBody } from "@heroui/card"
import { Input } from "@heroui/input"
import { Button } from "@heroui/button"
import { useForm } from "react-hook-form"
import { loginSchema, LoginSchema } from "@/lib/schemas/login-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInUser } from "@/actions/auth-actions"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import Image from "next/image"
import im from './log.jpg'

export default function LoginForm() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched'
  })

  async function onSubmit(data: LoginSchema) {
    const result = await signInUser(data)

    if (result.status === 'success') {
      router.push('/members')
      router.refresh()
      toast.success('You have logged in')
    } else {
      toast.error(result.error as string)
    }
  }
  return (
    <Card className="w-4/5 mx-auto p-0">
      <CardBody className="grid grid-cols-1 lg:grid-cols-4 p-0">
        <div className="col-span-2">
          <Image src={im} alt='login image' height={300} className="w-full h-full" />
        </div>
        <div className="col-span-2 p-12">
          <div className="py-4">
            <h1 className="text-red-500 font-semibold text-xl">Welcome Back</h1>
            <p className="mt-2">This website was created for fun</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
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
              <Button isLoading={isSubmitting} isDisabled={!isValid} fullWidth className="bg-red-500 text-white" type='submit'>Login</Button>
            </div>
          </form>
        </div>
      </CardBody>
    </Card >
  )
}
