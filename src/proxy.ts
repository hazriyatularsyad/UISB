import { NextRequest, NextResponse } from "next/server"
import { SESSION_COOKIE, verifySession } from "@/lib/auth"

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value
    if (!token || !verifySession(token)) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("from", pathname)
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith("/login")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value
    if (token && verifySession(token)) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}