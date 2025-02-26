import { Navbar, NavbarBrand, NavbarContent } from "@heroui/navbar";
import { Button } from "@heroui/button";
import Link from "next/link";
import NavLink from "./nav-link";
import { auth } from "@/auth";
import UserMenu from "./user-menu";
import { FaUserFriends } from "react-icons/fa";

export default async function TopNav() {
  const session = await auth()
  return (
    <Navbar isBordered isBlurred maxWidth="xl" classNames={{
      item: [
        'text-lg',
      ]
    }}>
      <NavbarBrand as={Link} href='/'>
        <FaUserFriends size={32} className="text-red-500" />
        <div className="font-bold text-3xl flex ">
          <span className="text-gray-900">Tam</span>
          <span className="text-red-500">Date</span>
        </div>
      </NavbarBrand>
      <NavbarContent justify="center" className="hidden lg:flex">
        <NavLink href='/members' label="Matches" />
        <NavLink href='/lists' label="Lists" />
        <NavLink href='/messages' label="Messages" />
      </NavbarContent>
      <NavbarContent justify="end">
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <>
            <Button as={Link} href='/login' variant="bordered" className="border border-red-500 text-red-500">Login</Button>
            <Button as={Link} href='/register' variant="bordered" className='bg-gray-900 text-white'>Register</Button>
          </>
        )}
      </NavbarContent>
    </Navbar >
  )
}
