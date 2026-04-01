import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isSignalsRoute = createRouteMatcher(["/signals(.*)"]);
const isPricingRoute = createRouteMatcher(["/pricing(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  if (!userId && (isSignalsRoute(req) || isPricingRoute(req))) {
    return redirectToSignIn();
  }

  if (userId && isSignalsRoute(req)) {
    const plan =
      (sessionClaims?.publicMetadata as { plan?: string } | undefined)?.plan;

    if (plan !== "pro") {
      return NextResponse.redirect(new URL("/pricing", req.url));
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};




