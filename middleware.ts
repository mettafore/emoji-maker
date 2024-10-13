import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(['/'])

export default clerkMiddleware(async (auth, req) => {
    // 1. Check if there is a user ID 
    // 2. If there is no user ID and the route is protected, redirect to sign in
    // 3. If there is a user ID, continue
    const { userId, redirectToSignIn } = auth();

    // If there is no user ID and the route is protected, redirect to sign in
    if (!userId && isProtectedRoute(req)) {
        return redirectToSignIn({ returnBackUrl: "/" });
    }

    // If there is a user ID and the route is protected, redirect to home
    if (userId && isProtectedRoute(req)) {
        return NextResponse.next();
    }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};