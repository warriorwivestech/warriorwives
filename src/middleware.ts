import { auth } from "@/auth";
import { NextResponse } from "next/server";

const protectedDirectories = [
  "/groups",
  "/all-groups",
  "/verification",
  "/connect",
];

export default auth((req) => {
  if (!req.auth?.user) {
    const url = new URL(req.url);

    if (protectedDirectories.some((dir) => url.pathname.startsWith(dir))) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sign-in`
      );
    }
  }
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/",
    "/groups/:path*",
    "/all-groups",
    "/verification",
    "/connect",
  ],
};
