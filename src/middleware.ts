import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([]);

export default clerkMiddleware(
  (auth, req) => {
    if (isProtectedRoute(req)) auth().protect();
  }
  // { debug: true }
);

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/(api|trpc)(.*)",
    // "/",
  ],
};
