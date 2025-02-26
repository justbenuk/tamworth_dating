import { fetchCurrentUserLikeIds, fetchLikedMembers } from "@/actions/like-actions";
import ListTabs from "@/components/lists-tab";
import PageContainer from "@/components/page-container";

export default async function ListsPage({ searchParams }: { searchParams: { type: string } }) {
  const likeIds = await fetchCurrentUserLikeIds()
  const search = await searchParams
  const members = await fetchLikedMembers(search.type)
  return (
    <PageContainer>
      <ListTabs members={members} listIds={likeIds} />
    </PageContainer>
  )
}

