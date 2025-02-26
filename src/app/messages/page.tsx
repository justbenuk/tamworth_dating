import { getMessagesByContainer } from "@/actions/message-actions";
import MessageTabs from "@/components/messages/message-tabs";
import PageContainer from "@/components/page-container";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { container: string };
}) {
  const { container } = await searchParams;
  const messages = await getMessagesByContainer(container);

  console.log(searchParams.container)

  return (
    <PageContainer>
      <MessageTabs messages={messages} />
    </PageContainer>
  );
}
