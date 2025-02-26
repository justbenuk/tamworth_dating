import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function PageContainer({ children }: Props) {
  return (
    <div className="mx-auto mx-w-7xl px-6 lg:px-0">{children}</div>
  )
}
