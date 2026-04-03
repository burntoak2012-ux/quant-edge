import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isSignalsRoute = createRouteMatcher(["/signals(.*)"]);
const isPricingRoute = createRouteMatcher(["/pricing(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId && (isSignalsRoute(req) || isPricingRoute(req))) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};




