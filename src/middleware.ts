import { auth as middleware } from "@/auth"
import { authRoutes, publicRoutes } from "./routes"
import { NextResponse } from "next/server"

export default middleware((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isPublic = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname)

  //accessing a public routes
  if (isPublic) {
    return NextResponse.next()
  }

  //accessing authenticated routes
  if (isAuthRoutes) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/members', nextUrl))
    }
    return NextResponse.next()
  }

  if (!isPublic && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  return NextResponse.next()

})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ]
}
