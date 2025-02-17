'use client'
import { HeroUIProvider } from "@heroui/react"
import { ReactNode } from "react"

type ProviderProps = {
  children: ReactNode
}

export default function Providers({ children }: ProviderProps) {
  return <HeroUIProvider>{children}</HeroUIProvider>
}
