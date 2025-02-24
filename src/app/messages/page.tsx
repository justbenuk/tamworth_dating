import { getMessagesByContainer } from "@/actions/message-actions";
import MessageSidebar from "@/components/messages/message-sidebar";
import MessageTable from "@/components/messages/message-table";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { container: string };
}) {
  const { container } = await searchParams;
  const messages = await getMessagesByContainer(container);

  return (
    <div className="grid grid-cols-12 gap-5 h-[80dvh] mt-10">
      <div className="col-span-2">
        <MessageSidebar />
      </div>
      <div className="col-span-10">
        <MessageTable messages={messages} />
      </div>
    </div>
  );
}
