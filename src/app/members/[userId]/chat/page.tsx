import { getAuthUserId } from "@/actions/auth-actions";
import { getMessageThread } from "@/actions/message-actions";
import CardInnerWrapper from "@/components/card-inner-wrapper";
import MessageList from "@/components/messages/message-list";
import ChatForm from "@/forms/chat-form";
import { createChatId } from "@/lib/utils";
export default async function MembersChat({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const id = await getAuthUserId();
  const messages = await getMessageThread(userId);
  const chatId = createChatId(id, userId);

  return (
    <CardInnerWrapper
      header="Chat"
      body={
        <MessageList
          initialMessages={messages}
          currentUserId={id}
          chatId={chatId}
        />
      }
      footer={<ChatForm />}
    />
  );
}
