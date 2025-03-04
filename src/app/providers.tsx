"use client";
import useFilterStore from "@/hooks/use-filter-store";
import { useNotificationChannel } from "@/hooks/use-notification-channel";
import usePaginationStore from "@/hooks/use-pagination-store";
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
  useFilterStore()
  usePaginationStore()
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
