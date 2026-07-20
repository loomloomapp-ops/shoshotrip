import { NextRequest, NextResponse } from "next/server";

/**
 * URL scheme:
 *   UA (default)  →  /            (internally rewritten to /ua)
 *   EN            →  /en/...
 * The [lang] route segment holds the real files; UA paths are rewritten to
 * the /ua tree so users never see a "/ua" prefix.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Never touch these.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  // EN tree serves as-is.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  // Avoid exposing the internal /ua prefix — redirect to the clean path.
  if (pathname === "/ua" || pathname.startsWith("/ua/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/ua/, "") || "/";
    return NextResponse.redirect(url);
  }

  // Everything else is UA → rewrite to the /ua tree internally.
  const url = request.nextUrl.clone();
  url.pathname = `/ua${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
