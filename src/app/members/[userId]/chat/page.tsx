import { getMessageThread } from "@/actions/message-actions";
import CardInnerWrapper from "@/components/card-inner-wrapper";
import MessageBox from "@/components/messages/message-box";
import ChatForm from "@/forms/chat-form";
export default async function MembersChat({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const messages = await getMessageThread(userId);

  const body = (
    <div>
      {messages.length === 0 ? (
        "No messages to display"
      ) : (
        <div>
          {messages.map((message) => (
            <MessageBox
              key={message.id}
              message={message}
              currentUserId={userId}
            />
          ))}
        </div>
      )}
    </div>
  );
  return <CardInnerWrapper header="Chat" body={body} footer={<ChatForm />} />;
}
