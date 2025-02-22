'use client'
import { signOutUserAction } from "@/actions/auth-actions"
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@heroui/react"
import { User } from "@prisma/client"
import { Session } from "next-auth"
import Link from "next/link"

type UserProps = {
  user: Session['user']
}
export default function UserMenu({ user }: UserProps) {

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as='button'
          className="transition-transform"
          color='secondary'
          name={user?.name || 'user'}
          size='sm'
          src={user?.image || '/images/user.png'}
        />
      </DropdownTrigger>
      <DropdownMenu variant="flat" aria-label="user actions menu">
        <DropdownSection showDivider>
          <DropdownItem key='userName' isReadOnly as='span' className="h-14 flex flex-row" aria-label="username">
            Signed in as {user?.name}
          </DropdownItem>
        </DropdownSection>
        <DropdownItem key='editProfile' as={Link} href='/members/edit'>
          Edit Profile
        </DropdownItem>
        <DropdownItem color='danger' key='logout' onPress={() => signOutUserAction()}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
