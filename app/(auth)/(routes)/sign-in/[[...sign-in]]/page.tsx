import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return <SignIn path="/sign-in" />;
}

// File Path: app/sign-in/[[...sign-in]]/page.ts
// Catch-all Route: The [[...sign-in]] part represents the "catch-all" route. This means it can handle all sub-URLs under sign-in.
// Thanks to this structure, you can process any URL accessed via a certain number or an indefinite number of path segments under sign-in. Example URLs could be:
//site.com/sign-in
//site.com/sign-in/step1
//site.com/sign-in/step1/details
//site.com/sign-in/any/number/of/nested/(routes)