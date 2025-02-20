import { fetchCurrentUserLikeIds, fetchLikedMembers } from "@/actions/like-actions";
import ListTabs from "@/components/lists-tab";

export default async function ListsPage({ searchParams }: { searchParams: { type: string } }) {
  const likeIds = await fetchCurrentUserLikeIds()
  const search = await searchParams
  const members = await fetchLikedMembers(search.type)
  return (
    <div>
      <ListTabs members={members} listIds={likeIds} />
    </div>
  )
}

