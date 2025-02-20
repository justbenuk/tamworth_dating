import { fetchCurrentUserLikeIds, fetchLikedMembers } from "@/actions/like-actions";
import ListTabs from "@/components/lists-tab";

export default async function ListsPage({ searchParams }: { searchParams: { type: string } }) {
  const likeIds = await fetchCurrentUserLikeIds()
  const members = await fetchLikedMembers(searchParams.type)
  return (
    <div>
      <ListTabs members={members} listIds={likeIds} />
    </div>
  )
}

