'use client'

import { Card, CardBody, CardHeader } from "@heroui/card"
import { Input } from "@heroui/input"
import { Button } from "@heroui/button"
import { GiPadlock } from "react-icons/gi"
import { useForm } from "react-hook-form"
import { registerSchema, RegisterSchema } from "@/lib/schemas/register-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerUserAction } from "@/actions/auth-actions"

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
      if (Array.isArray(result.error)) {
        result.error.forEach((e) => {
          const fieldName = e.path.join('.') as 'email' | 'name' | 'password'
          setError(fieldName, { message: e.message })
        })
      } else {
        setError('root.serverError', { message: result.error })
      }
    }
  }
  return (
    <Card className="w-2/5 mx-auto">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center text-secondary">
          <div className="flex flex-row items-center gap-3">
            <GiPadlock size={30} />
            <h1 className="text-3xl font-semibold">Login</h1>
          </div>
          <p className="text-neutral-500">Welcome to NextMatch</p>
        </div>
      </CardHeader>
      <CardBody>
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
            <Button isLoading={isSubmitting} isDisabled={!isValid} fullWidth color="secondary" type='submit'>Login</Button>
          </div>
        </form>
      </CardBody>
    </Card >
  )
}
