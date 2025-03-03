"use client";
import { MessageDto } from "@/types.index";
import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import { timeAgo } from "@/lib/utils";
import PresenceAvatar from "../presence-avatar";
type Props = {
  message: MessageDto;
  currentUserId: string;
};

export default function MessageBox({ message, currentUserId }: Props) {
  const isCurrentUserSender = message.senderId === currentUserId;
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messageEndRef]);

  function renderAvatar() {
    return (
      <div className="self-end">
        <PresenceAvatar
          userId={message.senderId}
          src={message.senderImage || "/images/user.png"}
        />
      </div>
    );
  }

  const messageContentclasses = clsx(
    "flex flex-col w-full lg:w-[50%] px-3 py-1",
    {
      "rounded-l-xl rounded-tr-xl text-white bg-blue-100": isCurrentUserSender,
      "rounded-r-xl rounded-tl-xl border-gray-200 bg-green-100":
        !isCurrentUserSender,
    }
  );

  function renderMessageHeader() {
    return (
      <>
        <div
          className={clsx("flex items-center w-full", {
            "justify-between": isCurrentUserSender,
          })}
        >
          {message.dateRead && message.recipientId !== currentUserId ? (
            <span className="text-xs text-black text-italic hidden sm:block">
              (Read {timeAgo(message.dateRead)})
            </span>
          ) : (
            <div></div>
          )}
          <div className="flex">
            <span className="text-xm font-semibold text-gray-900">
              {message.senderName}
            </span>
            <span className="text-xm text-gray-900 ml-2">
              {message.created}
            </span>
          </div>
        </div>
      </>
    );
  }

  function renderMessageContent() {
    return (
      <div className={messageContentclasses}>
        {renderMessageHeader()}
        <p className="text-sm py-3 text-gray-900">{message.text}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-1">
      <div
        className={clsx("flex gap-2 mb-3", {
          "justify-end text-right": isCurrentUserSender,
          "justify-start": !isCurrentUserSender,
        })}
      >
        {!isCurrentUserSender && renderAvatar()}
        {renderMessageContent()}
        {isCurrentUserSender && renderAvatar()}
      </div>
      <div ref={messageEndRef} />
    </div>
  );
}
