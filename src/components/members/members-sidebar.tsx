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
}
export default function MembersSidebar({ member }: MemberProps) {
  const basePath = `/members/${member.userId}`
  const navLinks = [
    { name: 'Profile', href: `${basePath}` },
    { name: 'Photos', href: `${basePath}/photos` },
    { name: 'Chat', href: `${basePath}/chat` }
  ]

  const pathname = usePathname()

  return (
    <Card className="mt-10 w-full items-center h-[80dvh]">
      <Image
        height={200}
        width={200}
        src={member.image || '/images/user.png'}
        alt='User profile image'
        className="rounded-full mt-6 aspect-square object-cover"
      />
      <CardBody>
        <div className="flex flex-col items-center">
          <div className="text-2xl">{member.name}, {calculateAge(member.dateOfBirth)}</div>
          <div className="text-sm text-neutral-500">{member.city}, {member.country}</div>
        </div>
        <Divider className="my-3" />
        <nav className="flex flex-col p-4 ml-4 text-2xl gap-4">
          {navLinks.map(link => (
            <Link href={link.href} key={link.name} className={`block rounded ${pathname === link.href ? 'text-secondary' : 'hover:text-secondary-50'}`}>{link.name}</Link>
          ))}
        </nav>
      </CardBody>
      <CardFooter>
        <Button as={Link} href='/members' color="secondary" variant="bordered" fullWidth>Go Back</Button>
      </CardFooter>
    </Card>
  )
}
