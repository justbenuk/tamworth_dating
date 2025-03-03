"use client";
import { messageSchema, MessageSchema } from "@/lib/schemas/message-schema";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiPaperAirplane } from "react-icons/hi2";
import { useParams, useRouter } from "next/navigation";
import { createMessage } from "@/actions/message-actions";
import { toast } from "react-toastify";
import { handleFormServerErrors } from "@/lib/utils";

export default function ChatForm() {
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { isSubmitting, isValid, errors },
  } = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    setFocus("text");
  }, [setFocus]);

  async function onSubmit(data: MessageSchema) {
    const result = await createMessage(params.userId, data);

    if (result.status === "error") {
      handleFormServerErrors(result, setError);
    } else {
      reset();
      toast.success("Message Sent");
      router.refresh();
      setTimeout(() => setFocus("text"), 50);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex items-center justify-center gap-2">
        <Input
          fullWidth
          placeholder="Type a message"
          variant="faded"
          {...register("text")}
          isInvalid={!!errors.text}
        />
        <Button
          type="submit"
          isIconOnly
          radius="full"
          isLoading={isSubmitting}
          isDisabled={!isValid || isSubmitting}
          className="bg-red-500 text-white"
        >
          <HiPaperAirplane size={18} />
        </Button>
      </div>
      <div className="flex flex-col">
        {errors.root?.serverError && (
          <p className="text-danger text-sm">
            {errors.root.serverError.message}
          </p>
        )}
      </div>
    </form>
  );
}
