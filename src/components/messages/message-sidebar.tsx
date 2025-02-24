"use client";
import { Chip } from "@heroui/react";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { GoInbox } from "react-icons/go";
import { MdOutlineOutbox } from "react-icons/md";

export default function MessageSidebar() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string>(
    searchParams.get("container") || "inbox"
  );
  const router = useRouter();
  const pathname = usePathname();

  function handleSelect(key: any) {
    setSelected(key);
    const params = new URLSearchParams();
    params.set("container", key);
    router.replace(`${pathname}?${params}`);
  }
  const items = [
    { key: "inbox", label: "Inbox", icon: GoInbox, chip: true },
    { key: "outbox", label: "Outbox", icon: MdOutlineOutbox, chip: false },
  ];
  return (
    <div className="flex flex-col shadow-md rounded-lg cursor-pointer">
      {items.map(({ key, icon: Icon, label, chip }) => (
        <div
          key={key}
          className={clsx("flex flex-row items-center rounded-t-lg gap-2 p-3", {
            "text-secondary font-semibold": selected === key,
            "text-black hover:text-secondary/70": selected !== key,
          })}
          onClick={() => {
            handleSelect(key);
          }}
        >
          <Icon size={24} />
          <div className="flex flex-row justify-between w-full">
            <span>{label}</span>
            {chip && <Chip>5</Chip>}
          </div>
        </div>
      ))}
    </div>
  );
}
