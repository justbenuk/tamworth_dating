'use client'
import { Button, Card, CardBody, CardHeader, CardFooter } from "@heroui/react"
import { BiSolidError } from 'react-icons/bi'
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center vertical-center">
      <Card className="w-2/5 mx-auto p-6">
        <CardHeader className="flex flex-col items-center justify-center">
          <div className="flex flex-col gap-2 items-center text-secondary">
            <BiSolidError size={30} />
            <h1 className="text-3xl font-semibold">Error</h1>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center text-danger">
            {error.message}
          </div>
        </CardBody>
        <CardFooter className='flex justify-center'>
          <Button onPress={() => reset()}>Try Again</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
