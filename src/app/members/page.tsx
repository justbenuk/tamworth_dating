import { getMembersAction } from "@/actions/member-actions"
import MemberItem from "@/components/members/members-item"

export default async function MembersPage() {

  //get all the members 
  const members = await getMembersAction()

  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:gird-cols-3 xl:grid-cols-6 gap-8">
      {members && members.map((member) => (
        <MemberItem member={member} key={member.id} />
      ))}
    </div>
  )
}
