"use client";
import { useNotificationChannel } from "@/hooks/use-notification-channel";
import { usePresenceChannel } from "@/hooks/usePressenceChannel";
import { HeroUIProvider } from "@heroui/react";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

type ProviderProps = {
  children: ReactNode;
  userId: string | null
};

export default function Providers({ children, userId }: ProviderProps) {
  usePresenceChannel();
  useNotificationChannel(userId)
  return (
    <HeroUIProvider>
      <ToastContainer
        position="bottom-right"
        hideProgressBar
        className="z-50"
      />
      {children}
    </HeroUIProvider>
  );
}
