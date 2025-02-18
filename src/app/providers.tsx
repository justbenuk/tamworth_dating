'use client'
import { HeroUIProvider } from "@heroui/react"
import { ReactNode } from "react"
import { ToastContainer } from "react-toastify"
type ProviderProps = {
  children: ReactNode
}

export default function Providers({ children }: ProviderProps) {
  return <HeroUIProvider>
    <ToastContainer position="bottom-right" hideProgressBar className='z-50' />
    {children}
  </HeroUIProvider>
}
