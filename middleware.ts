import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const unprotectedRoutes = createRouteMatcher([
    '/sign-in', // Ensure all sub-(routes) under sign-in are also unprotected
    '/sign-in/(.*)',
    '/sign-up', // Ensure all sub-(routes) under sign-up are also unprotected
    '/sign-up/(.*)'
]);

export default clerkMiddleware((auth, req) => {
    if (!auth().userId && !unprotectedRoutes(req)) {
        return auth().redirectToSignIn();
    }
});

export const config = { matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']};
