import { Spinner } from "@heroui/spinner"
export default function Loading() {
  return (
    <div className=" flex justify-center items-center vertical-center">
      <Spinner labelColor="secondary" color="secondary" label="Loading...." />
    </div>
  )
}
