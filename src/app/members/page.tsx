import { fetchCurrentUserLikeIds } from "@/actions/like-actions"
import { getMembersAction } from "@/actions/member-actions"
import EmptyState from "@/components/empty-state"
import MemberItem from "@/components/members/members-item"
import PageContainer from "@/components/page-container"
import PaginationComponent from "@/components/pagination/pagination-component"
import { UserFilters } from "@/types.index"

export default async function MembersPage({ searchParams }: { searchParams: UserFilters }) {
  const UserFilters = await searchParams

  //get all the members 
  const members = await getMembersAction(UserFilters)
  const likeIds = await fetchCurrentUserLikeIds()

  return (
    <PageContainer>
      {!members || members.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            {members && members.map((member) => (
              <MemberItem member={member} key={member.id} likeIds={likeIds} />
            ))}
          </div>
          <PaginationComponent />
        </>
      )
      }
    </PageContainer>
  )
}
