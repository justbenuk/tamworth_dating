'use client'

import { Member } from "@prisma/client"
import { Card, CardBody, CardFooter } from "@heroui/card"
import { Image } from "@heroui/image"
import { calculateAge } from "@/lib/utils"
import { Divider } from "@heroui/divider"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@heroui/button"

type MemberProps = {
  member: Member
  navLinks: { name: string, href: string }[]
}
export default function MembersSidebar({ member, navLinks }: MemberProps) {

  const pathname = usePathname()

  return (
    <Card shadow="none" className="mt-10 w-full items-center lg:h-[80dvh] bg-gray-900 text-gray-200">
      <Image
        height={'100'}
        width={'100'}
        src={member.image || '/images/user.png'}
        alt='User profile image'
        className="w-full rounded-sm pt-10"
      />
      <CardBody>
        <div className="flex flex-col items-center">
          <div className="text-lg lg:text-2xl text-red-500">{member.name}, {calculateAge(member.dateOfBirth)}</div>
          <div className="text-sm text-neutral-500">{member.city}, {member.country}</div>
        </div>
        <Divider className="my-3 bg-gray-200" />
        <nav className="flex flex-col p-4 ml-4 text-lg lg:text-2xl gap-4">
          {navLinks.map(link => (
            <Link href={link.href} key={link.name} className={`block text-md ${pathname === link.href ? 'text-red-500' : 'hover:text-red-500/70'}`}>{link.name}</Link>
          ))}
        </nav>
      </CardBody>
      <CardFooter>
        <Button as={Link} href='/members' variant="bordered" fullWidth className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white">Go Back</Button>
      </CardFooter>
    </Card>
  )
}
