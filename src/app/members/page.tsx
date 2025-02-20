import { fetchCurrentUserLikeIds } from "@/actions/like-actions"
import { getMembersAction } from "@/actions/member-actions"
import MemberItem from "@/components/members/members-item"

export default async function MembersPage() {

  //get all the members 
  const members = await getMembersAction()
  const likeIds = await fetchCurrentUserLikeIds()

  return (
    <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
      {members && members.map((member) => (
        <MemberItem member={member} key={member.id} likeIds={likeIds} />
      ))}
    </div>
  )
}
