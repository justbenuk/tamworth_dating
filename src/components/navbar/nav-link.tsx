'use client'
import { NavbarItem } from "@heroui/navbar"
import Link from "next/link"
import { usePathname } from "next/navigation"

type NavlinkProps = {
  href: string,
  label: string,
}
export default function NavLink({ href, label }: NavlinkProps) {
  const pathname = usePathname()
  return <NavbarItem as={Link} href={href} className={`${pathname === href ? 'text-red-500 font-semibold' : 'text-md'}`}>{label}</NavbarItem>
}
